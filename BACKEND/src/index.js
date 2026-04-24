import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import app from "./app.js";
import connectDB from "./db/index.js";

// ✅ NEW: Import HTTP + Socket
import http from "http";                     // ⭐ ADDED
import { initSocket } from "./sockets/chat.socket.js"; // ⭐ ADDED

dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    const PORT = process.env.PORT || 8000;

    // ✅ NEW: Create HTTP server
    const server = http.createServer(app);   // ⭐ ADDED

    // ✅ NEW: Initialize socket
    initSocket(server);                      // ⭐ ADDED

    // ❌ OLD (REMOVE THIS)
    // app.listen(PORT,() => {
    //     console.log(`server is running at port: ${PORT}`);
    // })

    // ✅ NEW: Use server.listen instead
    server.listen(PORT, () => {              // ⭐ UPDATED
        console.log(`🚀 Server is running at port: ${PORT}`);
    });

})
.catch((err) => {
    console.log("MONGODB CONNECTION failed!", err)
});