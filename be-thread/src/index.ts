import { AppDataSource } from "./data-source";
import * as express from "express";
import * as cors from "cors";

import router from "./routes";
import * as path from "path";

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors());
app.use("/v1", router);
app.use("/static", express.static(path.join(__dirname, "./uploads")));

AppDataSource.initialize()
  .then(async () => {
    app.listen(port, "0.0.0.0", () => {
      console.log("listening on port " + port);
    });
  })
  .catch(error => console.log(error));
