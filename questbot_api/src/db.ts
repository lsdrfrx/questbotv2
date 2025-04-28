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

PostgresSource.initialize();

export default PostgresSource;
