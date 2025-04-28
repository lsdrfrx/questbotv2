import { configDotenv } from "dotenv";

configDotenv();

export const config = {
  QUESTBOT_API_HOST: process.env.QUESTBOT_API_HOST || "localhost",
  QUESTBOT_API_PORT: process.env.QUESTBOT_API_PORT || 3000,
  QUESTBOT_API_AUTH_SECRET: process.env.QUESTBOT_API_AUTH_SECRET || "secret",
  QUESTBOT_API_AUTH_TTL: process.env.QUESTBOT_API_AUTH_TTL || 3600 * 24 * 7,
  POSTGRES_HOST: process.env.POSTGRES_HOST || "localhost",
  POSTGRES_PORT: process.env.POSTGRES_PORT || 5432,
  POSTGRES_USER: process.env.POSTGRES_USER || "postgres",
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || "postgres",
  POSTGRES_DB: process.env.POSTGRES_DB || "questbot",
};
