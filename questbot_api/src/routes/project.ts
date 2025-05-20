import { Router, Request, Response } from "express";
import { Project } from "../entities/Project";
import { PostgresSource } from "../db";
import { Employee } from "../entities/Employee";
import { Chat } from "../entities/Chat";
import { getManager } from "typeorm";

const projectRouter = Router();
const repo = PostgresSource.getRepository(Project);
const employeeRepo = PostgresSource.getRepository(Employee);
const chatRepo = PostgresSource.getRepository(Chat);

projectRouter.get("/metadata", async (req: Request, res: Response) => {
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
// Get all projects
projectRouter.get("/", async (req: Request, res: Response) => {
  const projects = await repo.find();
  res.json(projects);
});

// Get project by ID
projectRouter.get("/:id", async (req: Request, res: Response) => {
  const project = await repo.findOne({
    where: { id: Number(req.params.id) },
    relations: {
      subprojects: true,
      responsibleEmployee: true,
      chat: true,
    },
  });
  if (project === null) {
    res.status(404).json({});
    return;
  }
  res.json(project);
});

// Create new project
projectRouter.post("/", async (req: Request, res: Response) => {
  const data = req.body;
  const project = repo.create({
    projectName: data.projectName,
    projectNameFull: data.projectNameFull,
    contractorName: data.contractorName,
    contractorOrganization: data.contractorOrganization,
    startYear: data.startYear,
  });

  if (data.chat !== undefined) {
    const chat = await chatRepo.findOneBy({
      name: data.chat,
    });

    if (chat === null) {
      res.status(404).json({ message: "chat not found" });
      return;
    }

    project.chat = chat;
  }

  if (data.responsibleEmployee !== undefined) {
    const employee = await employeeRepo.findOneBy({
      usernameShort: data.responsibleEmployee,
    });

    if (employee === null) {
      res.status(404).json({ message: "employee not found" });
      return;
    }

    project.responsibleEmployee = employee;
  }

  const result = await repo.save(project);
  res.json(result);
});

// Update project by ID
projectRouter.put("/:id", async (req: Request, res: Response) => {
  const project = await repo.findOneBy({
    id: Number(req.params.id),
  });
  if (project === null) {
    res.status(404).json({});
    return;
  }
  const updatedProject = repo.merge(project, req.body);
  const result = await repo.save(updatedProject);
  res.json(result);
});

// Delete project by ID
projectRouter.delete("/:id", async (req: Request, res: Response) => {
  const project = await repo.findOneBy({
    id: Number(req.params.id),
  });
  if (project === null) {
    res.status(404).json({});
    return;
  }
  await repo.delete(req.params.id);
  res.json(project);
});

// Add project to subprojects
projectRouter.put(
  "/:id/subprojects/:subId",
  async (req: Request, res: Response) => {
    const parentProject = await repo.findOneBy({
      id: Number(req.params.id),
    });
    if (parentProject === null) {
      res.status(404).json({});
      return;
    }
    const subproject = await repo.findOneBy({
      id: Number(req.body.subId),
    });
    if (subproject === null) {
      res.status(404).json({});
      return;
    }

    if (parentProject.subprojects === undefined) parentProject.subprojects = [];

    parentProject.subprojects.push(subproject);

    const result = await repo.save(parentProject);

    res.json(result);
  },
);

// Delete project from subprojects
projectRouter.delete(
  "/:id/subprojects/:subId",
  async (req: Request, res: Response) => {
    const parentProject = await repo.findOne({
      relations: { subprojects: true },
      where: { id: Number(req.params.id) },
    });
    if (parentProject === null) {
      res.status(404).json({});
      return;
    }
    const subproject = await repo.findOneBy({
      id: Number(req.body.subId),
    });
    if (subproject === null) {
      res.status(404).json({});
      return;
    }

    parentProject.subprojects = parentProject.subprojects.filter(
      (sub) => sub.id !== Number(req.params.subId),
    );

    await repo.save(parentProject);

    res.json(parentProject);
  },
);

// Change responsible employee
projectRouter.put(
  "/:id/responsible/:employeeId",
  async (req: Request, res: Response) => {
    const project = await repo.findOneBy({
      id: Number(req.params.id),
    });
    if (project === null) {
      res.status(404).json({});
      return;
    }

    const employee = await employeeRepo.findOneBy({
      id: Number(req.params.employeeId),
    });
    if (employee === null) {
      res.status(404).json({});
      return;
    }

    project.responsibleEmployee = employee;
    await repo.save(project);

    res.json(project);
  },
);

// Delete responsible employee
projectRouter.delete(
  "/:id/responsible",
  async (req: Request, res: Response) => {
    const project = await repo.findOneBy({
      id: Number(req.params.id),
    });
    if (project === null) {
      res.status(404).json({});
      return;
    }

    project.responsibleEmployee = null;
    await repo.save(project);

    res.json(project);
  },
);

projectRouter.put("/:id/chat/:chatId", async (req: Request, res: Response) => {
  const project = await repo.findOneBy({
    id: Number(req.params.id),
  });
  if (project === null) {
    res.status(404).json({});
    return;
  }

  const chat = await chatRepo.findOneBy({
    id: Number(req.params.chatId),
  });
  if (chat === null) {
    res.status(404).json({});
    return;
  }

  project.chat = chat;
  await repo.save(project);

  res.json(project);
});

export default projectRouter;
