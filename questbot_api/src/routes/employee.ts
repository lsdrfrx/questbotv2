import { Router, Request, Response } from "express";
import { Employee } from "../entities/Employee";
import PostgresSource from "../db";

const employeeRouter = Router();
const repo = PostgresSource.getRepository(Employee)

employeeRouter.get("/", async (req: Request, res: Response) => {
  const employees = await repo.find();
  res.json(employees);
});

employeeRouter.get("/:id", async (req: Request, res: Response) => {
  const employee = await repo.findOneBy({
    id: req.params.id,
  });
  if (employee === null) {
    res.status(404).json({})
    return
  }
  res.json(employee);
});

employeeRouter.post("/", async (req: Request, res: Response) => {
  const employee = repo.create(req.body)
  const result = await repo.save(employee)
  res.json(result)
});

employeeRouter.put("/:id", async (req: Request, res: Response) => {
  const employee = await repo.findOneBy({
    id: req.params.id,
  })
  if (employee === null) {
    res.status(404).json({})
    return
  }
  const updatedEmployee = repo.merge(employee, req.body)
  const result = await repo.save(updatedEmployee)
  res.json(result)
});

employeeRouter.delete("/:id", async (req: Request, res: Response) => {
  const employee = await repo.findOneBy({
    id: req.params.id,
  })
  if (employee === null) {
    res.status(404).json({})
    return
  }
  await repo.delete(employee)
  res.json(employee)
});

export default employeeRouter;
