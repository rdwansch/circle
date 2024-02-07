import { Router } from "express";
import AuthenticateToken from "../middleware/AuthenticateToken";
import ReplyController from "../controller/ReplyController";
import UploadFile from "../middleware/UploadFile";

const router = Router();

router.get(
  "/reply/:threadId",
  AuthenticateToken,
  ReplyController.findAllByThreadId
);
router.post(
  "/reply/:threadId",
  AuthenticateToken,
  UploadFile.upload("image"),
  ReplyController.post
);

export default router;
