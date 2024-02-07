import { Request, Response } from "express";
import { postThreadSchema } from "../validation/ThreadSchema";
import * as JWT from "jsonwebtoken";
import { JWTSession } from "../types/UserType";
import sendMessageToQueue from "../libs/RabbitMQ";
import "dotenv/config";

// ALur
// routes - threadQueue (controller) - send to queue - return success - client

// di dalam queue akan diconsume oleh worker lalu secara async menjalankan logic
// dalam case ini, worker akan upload image ke cloudinary dan save database

// menghindari proses yang lama seperti upload gambar

export default new (class ThreadQueue {
  async post(req: Request, res: Response) {
    const data = { ...req.body, image: res.locals.filename };

    const { error, value } = postThreadSchema.validate(data);
    const token = res.locals.loginSession;
    const payload = JWT.decode(token) as JWTSession;

    if (error)
      return res.status(400).json({
        message: "Bad Request",
        error: error.message,
      });

    // insert data to queue
    const errorQueue = await sendMessageToQueue(process.env.THREAD_QUEUE_NAME, {
      ...value,
      currentUser: { id: payload.id },
    });

    if (errorQueue)
      return res.status(400).json({
        error: error.message,
      });

    return res.status(201).json({
      status: "OK",
    });
  }
})();
