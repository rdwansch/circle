import { AppDataSource } from "../data-source";
import * as amqp from "amqplib";
import ThreadWorker from "./ThreadWorker";
import "dotenv/config";

AppDataSource.initialize()
  .then(async () => {
    console.log(`connecting Queue ${process.env.RABBITMQ_URL}...`);
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    console.log("connected");

    await ThreadWorker.create(process.env.THREAD_QUEUE_NAME, connection);
  })
  .catch(() => console.log("error"));
