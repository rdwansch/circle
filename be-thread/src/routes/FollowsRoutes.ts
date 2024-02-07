import { Router } from "express";
import AuthenticateToken from "../middleware/AuthenticateToken";
import FollowsController from "../controller/FollowsController";

const router = Router();

router.post("/follows", AuthenticateToken, FollowsController.create);
router.get(
  "/followers/:id",
  AuthenticateToken,
  FollowsController.findFollowers
);
router.get(
  "/following/:id",
  AuthenticateToken,
  FollowsController.findFollowing
);
router.post("/unfollow/:id", AuthenticateToken, FollowsController.unfollow);

export default router;
