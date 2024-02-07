import { Request, Response } from "express";
import * as JWT from "jsonwebtoken";
import FollowService from "../service/FollowService";
import { JWTSession } from "../types/UserType";

export default new (class FollowsController {
  async create(req: Request, res: Response) {
    try {
      const token = res.locals.loginSession;
      const currentUser = JWT.decode(token) as JWTSession;
      await FollowService.create(currentUser.id, req.body.followingId);

      return res.status(200).json({
        status: "OK",
      });
    } catch (err) {
      // console.log("Error FollowsController::create", err.message);
      return res.status(400).json({
        message: err.message,
      });
    }
  }

  async findFollowers(req: Request, res: Response) {
    try {
      const followingId = req.params.id;
      const followers = await FollowService.findFollowers(Number(followingId));
      return res.status(200).json({
        status: "OK",
        data: followers,
      });
    } catch (err) {
      console.log("Error FollowsController::findFollowers", err.message);
      return res.status(400).json({
        message: err.message,
      });
    }
  }

  async findFollowing(req: Request, res: Response) {
    try {
      const followerId = req.params.id;
      const following = await FollowService.findFollowing(Number(followerId));
      return res.status(200).json({
        status: "OK",
        data: following,
      });
    } catch (err) {
      console.log("Error FollowsController::findFollowing", err.message);
      return res.status(400).json({
        message: err.message,
      });
    }
  }

  async unfollow(req: Request, res: Response) {
    try {
      const token = res.locals.loginSession;
      const follower = JWT.decode(token) as JWTSession;
      const followingId = req.params.id;

      await FollowService.unfollow(follower.id, Number(followingId));
      res.status(200).json({
        status: "OK",
      });
    } catch (err) {
      console.log("Error FollowsController::unfollow", err.message);
      return res.status(400).json({
        message: err.message,
      });
    }
  }
})();
