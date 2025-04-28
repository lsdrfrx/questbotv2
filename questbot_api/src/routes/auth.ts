import jwt from "jsonwebtoken";
import { Router, Request, Response } from "express";
import { hash } from "crypto";

import { config } from "../config";
import PostgresSource from "../db";
import { User } from "../entities/User";

const authRouter = Router();
const repo = PostgresSource.getRepository(User);

const userExist = async (username: string): boolean => {
  return (
    (await repo.findOneBy({
      username: username,
    })) === null
  );
};

const signToken = (data: object): string => {
  return jwt.sign(
    { exp: Date.now() + Number(config.QUESTBOT_API_AUTH_TTL), ...data },
    config.QUESTBOT_API_AUTH_SECRET,
    { algorithm: "HS256" },
  );
};

authRouter.get("/signin", async (req: Request, res: Response) => {
  const data = req.body;
  console.log(data);

  if (!userExist(data.username)) {
    res.status(400).json({ message: "wrong username or password" });
    return;
  }

  const user = await repo.findOneBy({
    username: data.username,
  });

  const hashedPassword = hash("sha256", data.password);

  if (user!.hashedPassword !== hashedPassword) {
    res.status(400).json({ message: "wrong username or password" });
    return;
  }

  const token = signToken({ username: data.username });

  res.json({ token: token });
});

authRouter.post("/signup", async (req: Request, res: Response) => {
  const data = req.body;

  if (!userExist(data.username)) {
    res.status(400).json({ message: "user already exist" });
    return;
  }

  const hashedPassword = hash("sha256", data.password);

  const user = repo.create({
    username: data.username,
    hashedPassword: hashedPassword,
  });

  await repo.save(user);

  const token = signToken({ username: data.username });

  res.status(201).json({ token: token });
});

authRouter.get("/logout", (req: Request, res: Response) => {
  res.json({});
});

export default authRouter;
