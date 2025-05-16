import express from "express";
import morgan from "morgan";
import cors from "cors";

import { config } from "./config";
import employeeRouter from "./routes/employee";
import projectRouter from "./routes/project";
import authRouter from "./routes/auth";
import questRouter from "./routes/quest";
import roleRouter from "./routes/role";
import chatRouter from "./routes/chat";
import divisionRouter from "./routes/division";
import userRouter from "./routes/user";
import { adminOnlyMiddleware, authMiddleware } from "./middlewares";

const app = express();

// Inject middlewares
app.use(
  cors({
    origin: "*",
    methods: "*",
    allowedHeaders: "*",
  }),
);
app.use(express.json());
app.use(express.urlencoded());
app.use(morgan("[:method] :url Status :status :response-time ms"));
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "*",
  }),
);

// Inject routers
app.use("/api/employees", authMiddleware, employeeRouter);
app.use("/api/projects", authMiddleware, projectRouter);
app.use("/api/quests", authMiddleware, questRouter);
app.use("/api/auth", authRouter);
app.use("/api/roles", authMiddleware, roleRouter);
app.use("/api/divisions", authMiddleware, divisionRouter);
app.use("/api/chats", authMiddleware, chatRouter);
app.use("/api/users", adminOnlyMiddleware, userRouter);

app.get("/", (req, res) => {
  res.json({});
});

app.listen(Number(config.QUESTBOT_API_PORT), config.QUESTBOT_API_HOST, () => {
  console.log(
    `Server listening on ${config.QUESTBOT_API_HOST}:${config.QUESTBOT_API_PORT}`,
  );
});
