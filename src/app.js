import "dotenv/config";
import express from "express";
import gameSessionRouter from "./routes/game-session.routes.js";
import playerRouter from "./routes/player.routes.js";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());
app.use("/game", gameSessionRouter);
app.use("/player", playerRouter);

export default app;
