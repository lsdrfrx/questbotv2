import express from "express";
import morgan from "morgan";
import cors from "cors";

import { config } from "./config";
import employeeRouter from "./routes/employee";
import projectRouter from "./routes/project";
import authRouter from "./routes/auth";
import roleRouter from "./routes/role";
import chatRouter from "./routes/chat";
import { authMiddleware } from "./middlewares";

const app = express();

// Inject middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(morgan("[:method] :url Status :status :response-time ms"));
app.use(authMiddleware);

// Inject routers
app.use("/employees", employeeRouter);
app.use("/projects", projectRouter);
app.use("/auth", authRouter);
app.use("/roles", roleRouter);
app.use("/chats", chatRouter);

app.listen(config.QUESTBOT_API_PORT, () => {
  console.log(`Server listening on port ${config.QUESTBOT_API_PORT}`);
});
