import { DataSource } from "typeorm";
import { config } from "./config";

export const postgresSource = new DataSource({
  type: "postgres",
  host: config.POSTGRES_HOST,
  port: config.POSTGRES_PORT,
  username: config.POSTGRES_USER,
  password: config.POSTGRES_PASS,
  database: config.POSTGRES_DB,
  entities: ["src/entities/*.js"],
});

export const mongodbSource = {};

export const redisSource = {};
