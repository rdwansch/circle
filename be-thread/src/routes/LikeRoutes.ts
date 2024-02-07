import { Router } from "express";
import AuthenticateToken from "../middleware/AuthenticateToken";
import LikeController from "../controller/LikeController";

const router = Router();

router.get("/like/:threadId", AuthenticateToken, LikeController.findAllByThreadId);
router.get("/like", AuthenticateToken, LikeController.findAll);
router.post("/like/:threadId", AuthenticateToken, LikeController.postLike);

export default router;
