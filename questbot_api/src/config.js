import { configDotenv } from "dotenv";

configDotenv();

export const config = {
  QUESTBOT_API_HOST: process.env.QUESTBOT_API_HOST || "localhost",
  QUESTBOT_API_PORT: process.env.QUESTBOT_API_PORT || 3000,
  POSTGRES_HOST: process.env.POSTGRES_HOST || "localhost",
  POSTGRES_PORT: process.env.POSTGRES_PORT || 5432,
  POSTGRES_USER: process.env.POSTGRES_USER || "postgres",
  POSTGRES_PASS: process.env.POSTGRES_PASS || "postgres",
  POSTGRES_DB: process.env.POSTGRES_DB || "questbot",
};
