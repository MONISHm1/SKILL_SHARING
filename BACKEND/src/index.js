import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import app from "./app.js";
import connectDB from "./db/index.js";

import http from "http";
import { initSocket } from "./sockets/chat.socket.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;

    const server = http.createServer(app);

    initSocket(server);

    server.listen(PORT, () => {
      console.log(` Server is running at port: ${PORT}`);
    });
  })
  .catch(err => {
    console.log("MONGODB CONNECTION failed!", err);
  });
