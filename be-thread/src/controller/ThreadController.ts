import { Request, Response } from "express";
import ThreadService from "../service/ThreadService";
import { postThreadSchema } from "../validation/ThreadSchema";
import * as JWT from "jsonwebtoken";
import { JWTSession } from "../types/UserType";
import ThreadQueue from "../queue/ThreadQueue";
import * as cloudinary from "cloudinary";
import "dotenv/config";

export default new (class ThreadController {
  async findAll(req: Request, res: Response) {
    const threads = await ThreadService.findAll();
    return res.json({
      status: 200,
      data: threads,
    });
  }

  async post(req: Request, res: Response) {
    // ThreadQueue.post(req, res);
    const data = { ...req.body, image: res.locals.filename };

    const { error, value } = postThreadSchema.validate(data);
    const token = res.locals.loginSession;
    const payload = JWT.decode(token) as JWTSession;

    cloudinary.v2.config({
      api_secret: process.env.API_SECRET,
      api_key: process.env.API_KEY,
      cloud_name: process.env.CLOUD_NAME,
    });
    const secure_url = await cloudinary.v2.uploader.upload("src/uploads/" + value.image);

    if (error)
      return res.status(400).json({
        message: "Bad Request",
        error: error.message,
      });

    try {
      await ThreadService.post({ ...value, currentUser: payload, image: { secure_url: secure_url.secure_url } });
      return res.status(200).json({
        message: "Thread was posted",
      });
    } catch (err) {
      return res.status(401).json({ message: "Failed save thread", error: err.message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const thread = await ThreadService.findById(Number(id));
      return res.status(200).json({
        res: "OK",
        data: thread,
      });
    } catch (err) {
      return res.status(404).json({
        message: "Thread not found",
      });
    }
  }

  async findByUserId(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const thread = await ThreadService.findByUserId(Number(id));
      return res.status(200).json({
        res: "OK",
        data: thread,
      });
    } catch (err) {
      return res.status(404).json({
        message: "Thread not found",
      });
    }
  }
})();
