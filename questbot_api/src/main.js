import express from "express";
import morgan from "morgan";

import { config } from "./config.js";
import userRouter from "./routes/user.js";

const app = express();

// Inject middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use(morgan("[:method] :url Status :status :response-time ms"));

// Inject routers
app.use("/user", userRouter);

app.listen(config.QUESTBOT_API_PORT, () => {
  console.log(`Server listening on port ${config.QUESTBOT_API_PORT}`);
});
