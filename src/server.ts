import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";
import { config } from "./app/config/configure";

let server: Server;

const { mongodbUrl } = config;
const PORT = 5000;

async function main() {
  try {
    await mongoose.connect(mongodbUrl);
    console.log("Mongodb database connected");
    server = app.listen(PORT, async () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}
main();
