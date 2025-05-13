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
import { authMiddleware } from "./middlewares";
import divisionRouter from "./routes/division";

const app = express();

// Inject middlewares
app.use(cors({
origin: ["https://qb.theorchem.ru", "https://ui:9900"],
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "*",
}));
app.use(express.json());
app.use(express.urlencoded());
app.use(morgan("[:method] :url Status :status :response-time ms"));

// Inject routers
app.use("/employees", authMiddleware, employeeRouter);
app.use("/projects", authMiddleware, projectRouter);
app.use("/quests", authMiddleware, questRouter);
app.use("/auth", authRouter);
app.use("/roles", authMiddleware, roleRouter);
app.use("/divisions", authMiddleware, divisionRouter);
app.use("/chats", authMiddleware, chatRouter);

app.get("/", (req, res) => {
  res.json({});
});

app.listen(Number(config.QUESTBOT_API_PORT), config.QUESTBOT_API_HOST, () => {
console.log(`Server listening on ${config.QUESTBOT_API_HOST}:${config.QUESTBOT_API_PORT}`);
});
