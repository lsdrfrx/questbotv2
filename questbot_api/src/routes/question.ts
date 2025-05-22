import { Router, Request, Response } from "express";
import { PostgresSource } from "../db";
import { Question } from "../entities/Question";
import { QuestionOption } from "../entities/QuestionOption";

const questionRepo = PostgresSource.getRepository(Question);
const optionsRepo = PostgresSource.getRepository(QuestionOption);
const questionRouter = Router();

questionRouter.get("/metadata", async (req: Request, res: Response) => {
  const metadata = questionRepo.metadata.columns;
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
  const questions = await questionRepo.find({
    relations: { options: true },
  });
  console.log(questions);
  res.json(questions);
});

// Create new question
questionRouter.post("/", async (req: Request, res: Response) => {
  const data = req.body;
  let options: QuestionOption[] = [];
  if (data.options && Array.isArray(data.options)) {
    // Сначала сохраняем ВСЕ опции
    options = await Promise.all(
      data.options.map(async (optionData: Object) => {
        const option = optionsRepo.create(optionData);
        return await optionsRepo.save(option);
      }),
    );
  }

  const question = questionRepo.create(data);
  question.options = options;

  // Сохраняем вопрос
  const savedQuestion = await questionRepo.save(question);

  res.json(savedQuestion);
});

// Modify question
questionRouter.put("/:id", async (req: Request, res: Response) => {
  let question = await questionRepo.findOneBy({
    id: req.params.id,
  });
  if (question === null) {
    res.status(404).json({ message: "question not found" });
  }

  question = questionRepo.merge(question, req.body);
  await questionRepo.save(question);

  res.json(question);
});

// Delete question by ID
questionRouter.delete("/:id", async (req: Request, res: Response) => {
  let question = await questionRepo.findOneBy({
    id: Number(req.params.id),
  });
  if (question === null) {
    res.status(404).json({ message: "question not found" });
  }

  await questionRepo.delete(req.params.id);

  res.json(question);
});

export default questionRouter;
