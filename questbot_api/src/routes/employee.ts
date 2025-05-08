import { Router, Request, Response } from "express";
import { Employee } from "../entities/Employee";
import PostgresSource from "../db";

const employeeRouter = Router();
const repo = PostgresSource.getRepository(Employee);

employeeRouter.get("/metadata", async (req: Request, res: Response) => {
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

employeeRouter.get("/", async (req: Request, res: Response) => {
  const employees = await repo.find();
  res.json(employees);
});

employeeRouter.get("/:id", async (req: Request, res: Response) => {
  const employee = await repo.findOneBy({
    id: req.params.id,
  });
  if (employee === null) {
    res.status(404).json({});
    return;
  }
  res.json(employee);
});

employeeRouter.post("/", async (req: Request, res: Response) => {
  const employee = repo.create(req.body);
  const result = await repo.save(employee);
  res.json(result);
});

employeeRouter.put("/:id", async (req: Request, res: Response) => {
  const employee = await repo.findOneBy({
    id: req.params.id,
  });
  if (employee === null) {
    res.status(404).json({});
    return;
  }
  const updatedEmployee = repo.merge(employee, req.body);
  const result = await repo.save(updatedEmployee);
  res.json(result);
});

employeeRouter.delete("/:id", async (req: Request, res: Response) => {
  const employee = await repo.findOneBy({
    id: req.params.id,
  });
  if (employee === null) {
    res.status(404).json({});
    return;
  }
  await repo.delete(employee);
  res.json(employee);
});

export default employeeRouter;
