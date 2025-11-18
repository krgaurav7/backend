import dotenv from "dotenv";
import connectDB from "./database/index.js";
import {app} from "./app.js"; // Importing the Express app

dotenv.config({
    path : "./env"
});

connectDB()
.then( () => {
    app.on("Error" , (error) => {
        throw error;
    })

    app.listen(process.env.PORT || 8000 , () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})
.catch( (error) => {
    console.error("Failed to connect to the database", error);
    process.exit(1); // Exit the process with failure
});
















/*
import express from "express";
const app = express();

;( async () => { // IIFE - Immediately Invoked Function Expression 
    try {
        await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
        app.on("Erroe" , (error)=> {
            console.error("Error connecting to the database", error);
        })

        app.listen(process.env.PORT , () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.error("Error connecting to the database", error);
    }
})();

*/

