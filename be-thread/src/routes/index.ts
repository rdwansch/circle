import ThreadRoutes from "./ThreadRoutes";
import ReplyRoutes from "./ReplyRoutes";
import UserRoutes from "./UserRoutes";
import LikeRoutes from "./LikeRoutes";
import FollowsRoutes from "./FollowsRoutes";
import { Router } from "express";

const router = Router();

router.use(ThreadRoutes);
router.use(UserRoutes);
router.use(ReplyRoutes);
router.use(LikeRoutes);
router.use(FollowsRoutes);

export default router;
