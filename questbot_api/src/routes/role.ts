import { Router, Request, Response } from "express";
import { PostgresSource } from "../db";
import { Role } from "../entities/Role";

const repo = PostgresSource.getRepository(Role);
const roleRouter = Router();

roleRouter.get("/metadata", async (req: Request, res: Response) => {
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

// Get all roles
roleRouter.get("/", async (req: Request, res: Response) => {
  const roles = await repo.find();
  res.json(roles);
});

// Get role by ID
roleRouter.get("/:id", async (req: Request, res: Response) => {
  const role = await repo.findOneBy({
    id: Number(req.params.id),
  });
  if (role === null) {
    res.status(404).json({ message: "role not found" });
  }

  res.json(role);
});

// Create new role
roleRouter.post("/", async (req: Request, res: Response) => {
  const role = repo.create(req.body);
  await repo.save(role);

  res.json(role);
});

// Modify role
roleRouter.put("/:id", async (req: Request, res: Response) => {
  let role = await repo.findOneBy({
    id: Number(req.params.id),
  });
  if (role === null) {
    res.status(404).json({ message: "role not found" });
  }

  role = repo.merge(role, req.body);
  await repo.save(role);

  res.json(role);
});

// Delete role by ID
roleRouter.delete("/:id", async (req: Request, res: Response) => {
  let role = await repo.findOneBy({
    id: Number(req.params.id),
  });
  if (role === null) {
    res.status(404).json({ message: "role not found" });
  }

  await repo.delete(req.params.id);

  res.json(role);
});

export default roleRouter;
