import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { authenticateToken } from "./utils/jwt.js";

// Import routes
import authRoutes from "./routes/auth.routes.js"
import accountRoutes from "./routes/account.routes.js"
import networkRoutes from "./routes/network.routes.js"
import coinRoutes from "./routes/coin.routes.js"
import tokenRoutes from "./routes/token.routes.js"


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
app.use("/api/coin", authenticateToken, coinRoutes);
app.use("/api/token", tokenRoutes);


export default app;
