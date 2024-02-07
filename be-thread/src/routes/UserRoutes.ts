import { Router } from "express";
import UserController from "../controller/UserController";
import UploadFile from "../middleware/UploadFile";
import AuthenticateToken from "../middleware/AuthenticateToken";

const router = Router();

router.post("/user/login", UserController.login);
router.post("/user/register", UserController.register);
router.get("/user/check", UserController.check);
router.get("/user/all", AuthenticateToken, UserController.suggestedUser);
router.get(
  "/user/getEditProfile/:id",
  AuthenticateToken,
  UserController.getEditProfile
);
router.patch(
  "/user/editProfile/:id",
  AuthenticateToken,
  UploadFile.upload("image"),
  UserController.editProfile
);
router.delete("/user/delete/:id", AuthenticateToken, UserController.delete);
router.get("/user/findAll", AuthenticateToken, UserController.findAll);

export default router;
