import { Router } from "express";

const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.send("USER INDEX");
});

userRouter.post("/", (req, res) => {});

userRouter.put("/", (req, res) => {});

userRouter.delete("/", (req, res) => {});

export default userRouter;
