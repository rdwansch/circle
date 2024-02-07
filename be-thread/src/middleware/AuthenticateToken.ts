import { NextFunction, Request, Response } from "express";
import * as JWT from "jsonwebtoken";
import "dotenv/config";

export default function AuthenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send("Unauthorized");
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    return res.status(401).send("Token is required");
  }

  try {
    JWT.verify(token, process.env.SECRET);
    res.locals.loginSession = token;
    next();
  } catch (err) {
    return res.status(401).send("Unauthorized");
  }
}
