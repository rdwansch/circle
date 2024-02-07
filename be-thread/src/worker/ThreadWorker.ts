import * as amqp from "amqplib";
import * as cloudinary from "cloudinary";
import "dotenv/config";
import ThreadService from "../service/ThreadService";
import { resSSE } from "../routes/ThreadRoutes";

export default new (class ThreadWorker {
  async create(queueName: string, connection: amqp.Connection) {
    try {
      const channel = await connection.createChannel();

      console.log(`consuming ${queueName}...`);
      channel.consume(
        queueName,
        async msg => {
          try {
            if (msg !== null) {
              const payload = JSON.parse(msg.content.toString());

              cloudinary.v2.config({
                api_secret: process.env.API_SECRET,
                api_key: process.env.API_KEY,
                cloud_name: process.env.CLOUD_NAME,
              });
              if (payload.image) {
                payload.image = await cloudinary.v2.uploader.upload("src/uploads/" + payload.image);

                resSSE.writeHead(200, {
                  "Content-Type": "text/event-stream",
                  Connection: "keep-alive",
                  "Cache-Control": "no-cache",
                });

                resSSE.write({
                  imageUrl: payload.image,
                });
              }

              console.log("saving database...");
              await ThreadService.post(payload);
            } else {
              console.log("Consumer cancelled by server");
            }
          } catch (err) {
            console.log("error consume", err?.error?.message);
          }
        },
        {
          noAck: false,
        }
      );
    } catch (err) {
      console.log("Error on ThreadWorker::create");
    }
  }
})();
