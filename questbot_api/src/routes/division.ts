import { Router, Request, Response } from "express";
import { PostgresSource } from "../db";
import { Division } from "../entities/Division";
import { Chat } from "../entities/Chat";

const repo = PostgresSource.getRepository(Division);
const chatRepo = PostgresSource.getRepository(Chat);
const divisionRouter = Router();

divisionRouter.get("/metadata", async (req: Request, res: Response) => {
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

// Get all divisions
divisionRouter.get("/", async (req: Request, res: Response) => {
  const divisions = await repo.find();
  res.json(divisions);
});

// Get division by ID
divisionRouter.get("/:id", async (req: Request, res: Response) => {
  const division = await repo.findOneBy({
    id: Number(req.params.id),
  });
  if (division === null) {
    res.status(404).json({ message: "division not found" });
  }

  res.json(division);
});

// Create new division
divisionRouter.post("/", async (req: Request, res: Response) => {
  const data = req.body;

  const division = repo.create({
    entity: data.entity,
    name: data.name,
  });

  if (data.chatId !== undefined) {
    const chat = await chatRepo.findOneBy({
      id: data.chatId,
    });
    if (chat === null) {
      res.status(404).json({ message: "chat not found" });
    }
    division.chat = chat;
  }

  await repo.save(division);

  res.json(division);
});

// Modify division
divisionRouter.put("/:id", async (req: Request, res: Response) => {
  let division = await repo.findOneBy({
    id: Number(req.params.id),
  });
  if (division === null) {
    res.status(404).json({ message: "division not found" });
  }

  division = repo.merge(division, req.body);
  await repo.save(division);

  res.json(division);
});

// Delete division by ID
divisionRouter.delete("/:id", async (req: Request, res: Response) => {
  let division = await repo.findOneBy({
    id: Number(req.params.id),
  });
  if (division === null) {
    res.status(404).json({ message: "division not found" });
  }

  await repo.delete(req.params.id);

  res.json(division);
});

export default divisionRouter;
