import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

// Import routes
import usersRoutes from "./routes/users.routes.js"

const app = express();

// middleware
app.use(helmet());
app.use(morgan("dev"));
// app.use(morgan("common"));
app.use(cors());
app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// routes
app.use("/hello", async (req, res) => {
    try {
        res.json("hello backend wallet");
    } catch (error) {}
});

app.use("/api/users", usersRoutes);

export default app;