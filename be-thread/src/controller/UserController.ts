import { Request, Response } from "express";
import {
  editProfileSchema,
  registerUserSchema,
} from "../validation/UserSchema";
import UserService from "../service/UserService";

export default new (class ThreadController {
  async register(req: Request, res: Response) {
    const { error, value } = registerUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: "failed to register user",
        error: error.message,
      });
    }

    try {
      const token = await UserService.register(value);

      res.locals.loginSession = token;

      return res.status(200).json({
        status: "OK",
        message: "Regristation successful",
        data: {
          token,
        },
      });
    } catch (err) {
      console.log("Error ThreadController::register", err.message);
      return res.status(400).json({
        message: err.message,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const token = await UserService.login({
        username: req.body.username,
        password: req.body.password,
      });

      res.locals.loginSession = token;

      return res.status(200).json({
        status: "OK",
        data: {
          token,
        },
      });
    } catch (err) {
      console.log("Error ThreadController::login", err.message);
      return res.status(401).json({
        message: "username or password doesn't match",
      });
    }
  }

  async check(req: Request, res: Response) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const user = UserService.check(token);
      res.locals.loginSession = token;

      return res.status(200).json({ message: "Token is valid", user });
    } catch (err) {
      console.log("Error ThreadController::check", err.message);
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
  }

  async editProfile(req: Request, res: Response) {
    const { error, value } = editProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: "failed to register user",
        error: error.message,
      });
    }

    const data = { ...value, id: +req.params.id };

    try {
      const user = await UserService.editProfile(data, res.locals.filename);

      res.status(201).json({
        data: user,
        status: "OK",
      });
    } catch (err) {
      res.status(500).json({ message: "Error on Update User" });
    }
  }

  async findAll(req: Request, res: Response) {
    const users = await UserService.findAll();
    return res.status(200).json({
      status: "OK",
      data: users,
    });
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id;

    const user = await UserService.delete(+id);
    return res.status(200).json({
      status: "OK",
    });
  }

  async getEditProfile(req: Request, res: Response) {
    const id = req.params.id;

    const user = await UserService.getEditProfile(+id);
    return res.status(200).json({
      status: "OK",
      data: user,
    });
  }

  async suggestedUser(req: Request, res: Response) {
    try {
      const users = await UserService.suggestedUser();
      return res.status(200).json({
        status: "OK",
        data: users,
      });
    } catch (err) {
      console.log("Error UserController::suggestedUser", err.message);
      return res.status(500);
    }
  }
})();
