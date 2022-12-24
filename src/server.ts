import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import handlebars from "handlebars";
import { readFileSync } from "fs";
//import { connectToDatabase } from "./api/employee/employee.collections";
import { connectToDatabase } from "./api/database/database";
import { employeeRouter } from "./api/employee/employee.routes";
import { userRouter } from "./api/auth";
import { AuthService } from "./api/auth/auth.service";

// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();

const { ATLAS_URI, API_PORT } = process.env;

if (!ATLAS_URI) {
  console.error(
    "No ATLAS_URI environment variable has been defined in config.env"
  );
  process.exit(1);
}

// The HTML content is produced by rendering a handlebars template.
// The template values are stored in global state for reuse.
const data = {
  service: process.env.K_SERVICE || "???",
  revision: process.env.K_REVISION || "???",
};

let template: any;

connectToDatabase(ATLAS_URI)
  .then(() => {
    const app = express();
    app.use(cors());

    app.get("/", (req, res) => {
      const name = process.env.NAME || "World";
      res.send(`Hello ${name}!`);
    });

    app.get("/help/", async (req: any, res: any) => {
      // The handlebars template is stored in global state so this will only once.
      if (!template) {
        // Load Handlebars template from filesystem and compile for use.
        try {
          template = handlebars.compile(
            readFileSync("./app/startup-index.html.hbs", "utf8")
          );
        } catch (e) {
          console.error(e);
          res.status(500).send("Internal Server Error");
        }
      }

      // Apply the template to the parameters to generate an HTML string.
      try {
        const output = template(data);
        res.status(200).send(output);
      } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
      }
    });

    // Serve the files in /assets at the URI /assets.
    app.use("/assets", express.static("assets"));

    // database
    // api/...
    app.use("/api/employee", employeeRouter);
    app.use("/api/auth", userRouter);

    // requires authentication
    app.post("/welcome", AuthService.verifyToken, (req, res) => {
      res.status(200).send("Welcome 🙌 ");
    });

    app.get("/welcome", AuthService.verifyToken, (req, res) => {
      res.status(200).send("Welcome 🙌 ");
    });

    // start the Express server
    const urlPort =
      parseInt(process.env.PORT, 10) || parseInt(API_PORT, 10) || 8080;
    app.listen(urlPort, () => {
      console.log(`Service: ${data.service}`);
      console.log(`Revision ${data.revision}`);
      console.log(`Server running at http://localhost:${urlPort}...`);
    });
  })
  .catch((error) => console.error(error));
