import { Request, Response } from "express";
import * as JWT from "jsonwebtoken";
import LikeService from "../service/LikeService";
import { JWTSession } from "../types/UserType";

export default new (class LikeController {
  async findAllByThreadId(req: Request, res: Response) {
    try {
      const threadId = req.params.threadId;
      const likes = await LikeService.findAllByThreadId(Number(threadId));

      return res.status(200).json({
        status: "OK",
        data: likes,
      });
    } catch (err) {
      console.log("Error LikeController::findAllByThreadId", err.message);
      return res.status(500);
    }
  }

  async findAll(req: Request, res: Response) {
    const likes = await LikeService.findAll();
    return res.status(200).json({
      status: "OK",
      data: likes,
    });
  }

  async postLike(req: Request, res: Response) {
    try {
      const threadId = req.params.threadId;
      const token = res.locals.loginSession;
      const payload = JWT.decode(token) as JWTSession;
      console.log(payload, "posting", threadId);

      //@ts-ignore
      await LikeService.postLike(Number(threadId), payload.id);
      return res.status(200).json({
        message: "Liked post",
      });
    } catch (err) {
      console.log("Error LikeController::postLike", err.message);
      return res.status(404).send("No post found");
    }
  }
})();
