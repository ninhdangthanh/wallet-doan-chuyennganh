import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import routes from "./routes/index.routes.js";
import { createServer } from "http"; // To handle both HTTP and WebSocket
import { WebSocketServer } from "ws"; // WebSocket support

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);

const server = createServer(app);

const wss = new WebSocketServer({ server });

// Handle WebSocket connections
wss.on("connection", (ws) => {
    console.log("New WebSocket connection");

    ws.on("message", (message) => {
        console.log(`Received message: ${message}`);
        wss.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
            client.send(`Server received: ${message}`);
        }
        });
    });

    ws.on("close", () => {
        console.log("WebSocket connection closed");
    });
});

export { app, server };
