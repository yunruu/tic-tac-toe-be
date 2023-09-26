import "dotenv/config";
import express from "express";
import gameSessionRouter from "./routes/game-session.routes.js";
import playerRouter from "./routes/player.routes.js";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use("/game", gameSessionRouter);
app.use("/player", playerRouter);

export default app;
