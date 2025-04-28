import { Router, Request, Response } from "express";
import { Project } from "../entities/Project";
import PostgresSource from "../db";

const projectRouter = Router();
const repo = PostgresSource.getRepository(Project)

projectRouter.get("/", async (req: Request, res: Response) => {
  const projects = await repo.find();
  res.json(projects);
});

projectRouter.get("/:id", async (req: Request, res: Response) => {
  const project = await repo.findOneBy({
    id: req.params.id,
  });
  if (project === null) {
    res.status(404).json({})
    return
  }
  res.json(project);
});

projectRouter.post("/", async (req: Request, res: Response) => {
  const project = repo.create(req.body)
  const result = await repo.save(project)
  res.json(result)
});

projectRouter.put("/:id", async (req: Request, res: Response) => {
  const project = await repo.findOneBy({
    id: req.params.id,
  })
  if (project === null) {
    res.status(404).json({})
    return
  }
  const updatedProject = repo.merge(project, req.body)
  const result = await repo.save(updatedProject)
  res.json(result)
});

projectRouter.delete("/:id", async (req: Request, res: Response) => {
  const project = await repo.findOneBy({
    id: req.params.id,
  })
  if (project === null) {
    res.status(404).json({})
    return
  }
  await repo.delete(project)
  res.json(project)
});

export default projectRouter;
