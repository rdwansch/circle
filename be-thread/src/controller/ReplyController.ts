import { Request, Response } from "express";
import * as JWT from "jsonwebtoken";

import ReplyService from "../service/ReplyService";
import { postReplySchema } from "../validation/ReplySchema";
import { JWTSession } from "../types/UserType";

export default new (class ReplyController {
  async findAllByThreadId(req: Request, res: Response) {
    const threadId = req.params.threadId;

    const replies = await ReplyService.findAllByThreadId(Number(threadId));
    return res.status(200).json({ status: "OK", data: replies });
  }

  async post(req: Request, res: Response) {
    const data = { ...req.body, image: res.locals.filename };

    const { error, value } = postReplySchema.validate(data);
    const token = res.locals.loginSession;
    const payload = JWT.decode(token) as JWTSession;

    if (error)
      return res.status(400).json({
        message: "Bad Request",
        error: error.message,
      });

    try {
      await ReplyService.post({
        content: value.content,
        image: value.image,
        threadId: Number(req.params.threadId),
        currentUser: payload as JWTSession,
      });

      return res.status(200).json({
        message: "Reply was posted",
      });
    } catch (err) {
      return res.status(500).json({
        message: "Failed post reply",
        error: err.message,
      });
    }
  }
})();
