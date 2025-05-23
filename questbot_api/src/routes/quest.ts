import { Router, Request, Response } from "express";
import { PostgresSource } from "../db";
import { Quest } from "../entities/Quest";
import { Employee } from "../entities/Employee";
import { Project } from "../entities/Project";
import { Role } from "../entities/Role";
import moment from "moment";
import { Question } from "../entities/Question";
import { In } from "typeorm";
import { Chat } from "../entities/Chat";

const questRepo = PostgresSource.getRepository(Quest);
const employeeRepo = PostgresSource.getRepository(Employee);
const projectRepo = PostgresSource.getRepository(Project);
const roleRepo = PostgresSource.getRepository(Role);
const questionRepo = PostgresSource.getRepository(Question);
const chatRepo = PostgresSource.getRepository(Chat);

const questRouter = Router();

const getQuest = async (id: string) => {
  return await questRepo.findOne({
    where: { id: Number(id) },
    relations: {
      employee: true,
      questioner: true,
      recepientChats: true,
      recepientEmployees: true,
      role: true,
    },
  });
};

questRouter.get("/metadata", async (req: Request, res: Response) => {
  const metadata = questRepo.metadata.columns;
  const relations = questRepo.metadata.relations;

  const list = metadata.map((v) => {
    return {
      name: v.propertyName,
      required: v.isNullable,
      defaultValue: v.default,
      label: v.comment,
      value: null,
      type: v.type,
      relations: v.relationMetadata?.inverseEntityMetadata.tableName,
    };
  });

  relations.map((v) => {
    if (v.junctionEntityMetadata !== undefined) {
      list.push({
        name: v.propertyName,
        required: v.isNullable,
        defaultValue: null,
        label: null,
        value: null,
        type: v.type,
        joins: v.junctionEntityMetadata.tableName,
      });
    }
  });

  res.json(list);
});

// Get all quests
questRouter.get("/", async (req: Request, res: Response) => {
  const quests = await questRepo.find({
    relations: {
      employee: true,
      recepientChats: true,
      recepientEmployees: true,
      project: true,
      role: true,
      questioner: true,
    },
  });
  res.json(quests);
});

// Get quest by ID
questRouter.get("/:id", async (req: Request, res: Response) => {
  const quest = await getQuest(req.params.id);
  if (quest === null) {
    res.status(404).json({ message: "quest not found" });
    return;
  }

  res.json(quest);
});

// Create new quest
questRouter.post("/", async (req: Request, res: Response) => {
  const data = req.body;
  console.log(data);

  const employee = await employeeRepo.findOneBy({
    id: Number(data.employee),
  });
  if (employee === null) {
    res.status(404).json({ message: "employee not found" });
    return;
  }

  const questioner = await employeeRepo.findOneBy({
    id: Number(data.questioner),
  });
  if (questioner === null) {
    res.status(404).json({ message: "employee not found" });
    return;
  }

  const role = await roleRepo.findOneBy({
    id: Number(data.role),
  });
  if (role === null) {
    res.status(404).json({ message: "role not found" });
    return;
  }

  const recepientEmployees = await employeeRepo.find({
    where: { id: In(data.recepientEmployees) },
  });
  const recepientChats = await chatRepo.find({
    where: { id: In(data.recepientChats) },
  });

  const nextTime = moment(data.nextTime);
  const deadline = moment(data.deadline);

  const quest = questRepo.create({
    questName: data.questName,
    questions: data.questions || [],
    reminders: data.reminders,
    timeToAnswer: data.timeToAnswer,
    recepientChats: recepientChats,
    recepientEmployees: recepientEmployees,
    employee: employee,
    questioner: questioner,
    nextTime: nextTime.isValid ? nextTime.toDate() : null,
    deadline: deadline.isValid ? deadline.toDate() : null,
    role: role,
  });

  await questRepo.save(quest);
  res.json(quest);
});

// Modify quest by ID
questRouter.put("/:id", async (req: Request, res: Response) => {
  const data = req.body;
  const quest = await getQuest(req.params.id);

  if (quest === null) {
    res.status(404).json({ message: "quest not found" });
    return;
  }

  if (data.nextTime) {
    data.nextTime = moment(data.nextTime);
    if (data.nextTime.isValid()) {
      data.nextTime = data.nextTime.toDate();
    } else {
      res.status(400).json({ message: "invalid next time date format" });
      return;
    }
  }

  if (data.deadline) {
    data.deadline = moment(data.deadline);
    if (data.deadline.isValid()) {
      data.deadline = data.deadline.toDate();
    } else {
      res.status(400).json({ message: "invalid next time date format" });
      return;
    }
  }

  const updatedQuest = questRepo.merge(quest, req.body);
  await questRepo.save(updatedQuest);

  res.json(updatedQuest);
});

// Delete quest by ID
questRouter.delete("/:id", async (req: Request, res: Response) => {
  const quest = await getQuest(req.params.id);

  if (quest === null) {
    res.status(404).json({});
    return;
  }

  await questRepo.delete(req.params.id);
  res.json(quest);
});

// Finish quest
questRouter.get("/:id", async (req: Request, res: Response) => {
  const quest = await getQuest(req.params.id);

  if (quest === null) {
    res.status(404).json({});
    return;
  }

  quest.finished = true;
  await questRepo.save(quest);

  res.json(quest);
});

// Toggle inProgress field in quest by ID
questRouter.get("/:id/toggleProgress", async (req: Request, res: Response) => {
  const quest = await getQuest(req.params.id);

  if (quest === null) {
    res.status(404).json({});
    return;
  }

  quest.inProgress = !quest.inProgress;
  await questRepo.save(quest);

  res.json({ inProgress: quest.inProgress });
});

// Change quest linked project
questRouter.put(
  "/:id/project/:projectId",
  async (req: Request, res: Response) => {
    const quest = await getQuest(req.params.id);

    if (quest === null) {
      res.status(404).json({ message: "quest not found" });
      return;
    }

    const project = await projectRepo.findOneBy({
      id: Number(req.params.projectId),
    });

    if (project === null) {
      res.status(404).json({ message: "project not found" });
      return;
    }

    quest.project = project;
    await questRepo.save(quest);

    res.json(quest);
  },
);

// Change quest employee
questRouter.put(
  "/:id/employee/:employeeId",
  async (req: Request, res: Response) => {
    const quest = await getQuest(req.params.id);

    if (quest === null) {
      res.status(404).json({ message: "quest not found" });
      return;
    }

    const employee = await employeeRepo.findOneBy({
      id: Number(req.params.id),
    });

    if (employee === null) {
      res.status(404).json({ message: "employee not found" });
      return;
    }

    quest.employee = employee;
    await questRepo.save(quest);

    res.json(quest);
  },
);

// Change quest questioner
questRouter.put(
  "/:id/questioner/:employeeId",
  async (req: Request, res: Response) => {
    const quest = await getQuest(req.params.id);

    if (quest === null) {
      res.status(404).json({ message: "quest not found" });
      return;
    }

    const employee = await employeeRepo.findOneBy({
      id: Number(req.params.id),
    });

    if (employee === null) {
      res.status(404).json({ message: "employee not found" });
      return;
    }

    quest.questioner = employee;
    await questRepo.save(quest);

    res.json(quest);
  },
);

// Modify quest recepientChats
questRouter.put("/:id/recepientChats", (req: Request, res: Response) => {
  res.json({});
});

export default questRouter;
