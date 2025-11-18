import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin : `${process.env.CORS_ORIGIN}`,
    credentials : true,
})); // Enable CORS for all routes


app.use(express.json({
    limit : "16mb",
})); // Middleware to parse JSON request bodies

app.use(express.urlencoded({
    extended : true,
    limit : "16mb",
})); // Middleware to parse URL-encoded request bodies

app.use(express.static("public")); // Serve static files from the "public" directory

app.use(cookieParser()); // Middleware to parse cookies to the request object

// Define a simple health check route
import userRouter from "./routes/user.routes.js"

//route declaration
app.use("/api/v1/users", userRouter) // it will pass to /users route

export { app }; 