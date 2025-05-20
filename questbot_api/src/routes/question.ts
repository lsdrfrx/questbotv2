import { Router, Request, Response } from "express";
import { PostgresSource } from "../db";
import { Question } from "../entities/Question";

const repo = PostgresSource.getRepository(Question);
const questionRouter = Router();

questionRouter.get("/metadata", async (req: Request, res: Response) => {
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

// Get all questions
questionRouter.get("/", async (req: Request, res: Response) => {
  const questions = await repo.find();
  res.json(questions);
});

// Get question by ID
questionRouter.get("/:id", async (req: Request, res: Response) => {
  const question = await repo.findOneBy({
    id: Number(req.params.id),
  });
  if (question === null) {
    res.status(404).json({ message: "question not found" });
  }

  res.json(question);
});

// Create new question
questionRouter.post("/", async (req: Request, res: Response) => {
  const question = repo.create(req.body);
  await repo.save(question);

  res.json(question);
});

// Modify question
questionRouter.put("/:id", async (req: Request, res: Response) => {
  let question = await repo.findOneBy({
    id: Number(req.params.id),
  });
  if (question === null) {
    res.status(404).json({ message: "question not found" });
  }

  question = repo.merge(question, req.body);
  await repo.save(question);

  res.json(question);
});

// Delete question by ID
questionRouter.delete("/:id", async (req: Request, res: Response) => {
  let question = await repo.findOneBy({
    id: Number(req.params.id),
  });
  if (question === null) {
    res.status(404).json({ message: "question not found" });
  }

  await repo.delete(req.params.id);

  res.json(question);
});

export default questionRouter;
