import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

// Import routes
import authRoutes from "./routes/auth.routes.js"
import accountRoutes from "./routes/account.routes.js"
import networkRoutes from "./routes/network.routes.js"
import { authenticateToken } from "./utils/jwt.js";

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
        return res.json("hello backend wallet");
    } catch (error) {}
});

app.use("/api/auth", authRoutes);
app.use("/api/account", authenticateToken, accountRoutes);
app.use("/api/network", authenticateToken, networkRoutes);
app.get('/secure-route', authenticateToken, (req, res) => {
    console.log(req.user);
    res.json({ message: 'This is a secure route', user: req.user });
});


export default app;
