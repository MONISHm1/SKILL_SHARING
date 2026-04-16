import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import app from "./app.js";
import connectDB from "./db/index.js";


dotenv.config({
    path: './.env'
})


connectDB()
.then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT,() => {
        console.log(`server is running at port: ${PORT}`);
    })
})
.catch((err) => {
    console.log("MONGODB CONNECTION failed!",err)
})