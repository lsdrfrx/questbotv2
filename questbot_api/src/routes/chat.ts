import { Router, Request, Response } from "express";
import { PostgresSource } from "../db";
import { Chat } from "../entities/Chat";

const repo = PostgresSource.getRepository(Chat);
const chatRouter = Router();

chatRouter.get("/metadata", async (req: Request, res: Response) => {
  const metadata = repo.metadata.columns;
  res.json(
    metadata.map((v) => {
      return {
        name: v.propertyName,
        required: v.isNullable,
        defaultValue: v.default,
        label: v.comment,
        type: v.type,
        relations: v.relationMetadata?.inverseEntityMetadata.tableName,
      };
    }),
  );
});

// Get all chats
chatRouter.get("/", async (req: Request, res: Response) => {
  const chats = await repo.find();
  res.json(chats);
});

// Get chat by ID
chatRouter.get("/:id", async (req: Request, res: Response) => {
  const chat = await repo.findOneBy({
    id: Number(req.params.id),
  });
  if (chat === null) {
    res.status(404).json({ message: "chat not found" });
  }

  res.json(chat);
});

// Create new chat
chatRouter.post("/", async (req: Request, res: Response) => {
  const chat = repo.create(req.body);
  await repo.save(chat);

  res.json(chat);
});

// Modify chat
chatRouter.put("/:id", async (req: Request, res: Response) => {
  const chat = await repo.findOneBy({
    id: Number(req.params.id),
  });
  if (chat === null) {
    res.status(404).json({ message: "chat not found" });
  }

  const updatedChat = repo.merge(chat, req.body);
  await repo.save(updatedChat);

  res.json(updatedChat);
});

// Delete chat by ID
chatRouter.delete("/:id", async (req: Request, res: Response) => {
  const chat = await repo.findOneBy({
    id: Number(req.params.id),
  });
  if (chat === null) {
    res.status(404).json({ message: "chat not found" });
  }

  await repo.delete(req.params.id);

  res.json(chat);
});

export default chatRouter;
