import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Thread } from "./entity/Thread";
import { Reply } from "./entity/Reply";
import { Like } from "./entity/Like";
import { Follow } from "./entity/Follow";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "root",
  database: "thread",
  synchronize: true,
  logging: false,
  entities: [User, Thread, Reply, Like, Follow],
  migrations: ["src/migration/*.ts"],
  subscribers: [],
});
