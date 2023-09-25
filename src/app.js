import "dotenv/config";
import express from "express";
import gameRouter from "./routes/game.routes.js";
import playerRouter from "./routes/player.routes.js";

const app = express();

app.use("/game", gameRouter);
app.use("/player", playerRouter);

export default app;
