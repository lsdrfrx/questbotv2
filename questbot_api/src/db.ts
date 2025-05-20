import { DataSource } from "typeorm";
import { config } from "./config";

const PostgresSource = new DataSource({
  type: "postgres",
  host: config.POSTGRES_HOST,
  port: Number(config.POSTGRES_PORT),
  username: config.POSTGRES_USER,
  password: config.POSTGRES_PASSWORD,
  database: config.POSTGRES_DB,
  entities: ["src/entities/*.ts"],
  synchronize: true,
});

const MongoSource = new DataSource({
  type: "mongodb",
  host: config.MONGO_HOST,
  port: Number(config.MONGO_PORT),
  username: config.MONGO_USER,
  password: config.MONGO_PASSWORD,
  database: config.MONGO_DB,
  authSource: "admin",
  entities: ["src/entities/mongo/*.ts"],
  synchronize: true,
})

PostgresSource.initialize();
MongoSource.initialize();

export { PostgresSource, MongoSource }
