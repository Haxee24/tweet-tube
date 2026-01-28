import connectDB from "./db/index.js";
import dotenv from 'dotenv';
dotenv.config({
    path: './env'
});

connectDB();

// import mongoose, { mongo } from 'mongoose';
// import express from 'express';
// import { DB_NAME } from './constants.js';

// const app = express();

// ( async () => {
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         app.on("error", (error) => {
//             console.log("ERROR: ", error);
//             throw error;
//         })

//         app.listen(process.env.PORT, () => {
//             console.log("APP IS LISTENING ON PORT: ", process.env.PORT);
//         })
//     } catch(err){
//         console.error(err.stack);
//         throw err;
//     }
// } )();