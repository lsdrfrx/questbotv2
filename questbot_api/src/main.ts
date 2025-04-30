import express from "express";
import { Request, Response } from "express";
import { expressjwt as jwt } from "express-jwt";
import morgan from "morgan";
import cors from "cors";

import { config } from "./config";
import employeeRouter from "./routes/employee";
import projectRouter from "./routes/project";
import authRouter from "./routes/auth";
import roleRouter from "./routes/role";

const app = express();

// Inject middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(morgan("[:method] :url Status :status :response-time ms"));
app.use(
  jwt({
    secret: config.QUESTBOT_API_AUTH_SECRET,
    algorithms: ["HS256"],
  }).unless({ path: ["/auth/signin", "/auth/signup"] }),
);
app.use((err: Error, _req: Request, res: Response, next: Function) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ message: "invalid token error" });
  } else {
    next(err);
  }
});

// Inject routers
app.use("/employees", employeeRouter);
app.use("/projects", projectRouter);
app.use("/auth", authRouter);
app.use("/roles", roleRouter);

app.listen(config.QUESTBOT_API_PORT, () => {
  console.log(`Server listening on port ${config.QUESTBOT_API_PORT}`);
});
