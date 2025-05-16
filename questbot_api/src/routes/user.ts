import { Router, Request, Response } from "express";
import PostgresSource from "../db";
import { User } from "../entities/User";

const repo = PostgresSource.getRepository(User);
const userRouter = Router();

userRouter.get("/metadata", async (req: Request, res: Response) => {
  const metadata = repo.metadata.columns;
  res.json(
    metadata.map((v) => {
      return {
        name: v.propertyName,
        required: v.isNullable,
        defaultValue: v.default,
        label: v.comment,
        value: null,
        type: v.type,
        relations: v.relationMetadata?.inverseEntityMetadata.tableName,
      };
    }),
  );
});

// Get all users
userRouter.get("/", async (req: Request, res: Response) => {
  const users = await repo.find();
  res.json(users.map((u) => {
    u.hashedPassword = "HIDDEN"
    return u
  }));
});

// Get user by ID
userRouter.get("/:id", async (req: Request, res: Response) => {
  const user = await repo.findOneBy({
    id: Number(req.params.id),
  });
  if (user === null) {
    res.status(404).json({ message: "user not found" });
  }

  user.hashedPassword = "HIDDEN"

  res.json(user);
});

// Create new user
userRouter.post("/", async (req: Request, res: Response) => {
  const user = repo.create(req.body);
  await repo.save(user);

  res.json(user);
});

// Modify user
userRouter.put("/:id", async (req: Request, res: Response) => {
  let user = await repo.findOneBy({
    id: Number(req.params.id),
  });
  if (user === null) {
    res.status(404).json({ message: "user not found" });
  }

  user = repo.merge(user, req.body);
  await repo.save(user);

  res.json(user);
});

// Delete user by ID
userRouter.delete("/:id", async (req: Request, res: Response) => {
  let user = await repo.findOneBy({
    id: Number(req.params.id),
  });
  if (user === null) {
    res.status(404).json({ message: "user not found" });
  }

  await repo.delete(req.params.id);

  res.json(user);
});

export default userRouter;
