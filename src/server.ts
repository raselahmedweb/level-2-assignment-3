import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";
let server: Server;

const PORT = 5000;
async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://mongodb:mongodb@cluster0.zmilpe0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log('Mongodb database connected');
    server = app.listen(PORT, async () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

main();
