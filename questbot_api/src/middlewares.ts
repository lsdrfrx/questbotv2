import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "./config";

export const authMiddleware = (req: Request, res: Response, next: Function) => {
  const authType = req.headers["auth-type"];

  if (authType === "web") {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(400).json({ message: "token does not specified" });
    }

    jwt.verify(token, config.QUESTBOT_API_AUTH_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "invalid token" });
      }
      next();
    });
  } else if (authType === "bot") {
    if (!config.QUESTBOT_API_AUTH_BOT_SECRET) {
      return res.status(403).json({ message: "bot api key not found" });
    }

    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(400).json({ message: "token does not specified" });
    }

    if (token !== config.QUESTBOT_API_AUTH_BOT_SECRET) {
      return res.status(403).json({ message: "invalid bot api token" });
    }

    next();
  } else {
    res.status(403).json({ message: "unknown Auth-Type" });
  }
};

export const adminOnlyMiddleware = (
  req: Request,
  res: Response,
  next: Function,
) => {
  const authType = req.headers["auth-type"];

  if (authType !== "web") {
    return res.status(403).json({ message: "unknown Auth-Type" });
  }

  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(400).json({ message: "token does not specified" });
  }

  jwt.verify(token, config.QUESTBOT_API_AUTH_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "invalid token" });
    }
    if (user.role !== "admin") {
      return res.status(403).json({ message: "not enough rights :(" });
    }
    next();
  });
};
