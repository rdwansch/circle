import * as amqp from "amqplib";
import "dotenv/config";

export default async function sendMessageToQueue(
  queueName: string,
  payload: any
) {
  try {
    // create connection
    const connection = await amqp.connect(process.env.RABBITMQ_URL);

    // create channel
    const channel = await connection.createChannel();

    // create queue
    await channel.assertQueue(queueName);

    // send to queue
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)));

    await channel.close();
    await connection.close();
  } catch (err) {
    return err;
  }
}
