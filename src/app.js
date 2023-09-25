import "dotenv/config";
import express from "express";
import gameSessionRouter from "./routes/game-session.routes.js";
import playerRouter from "./routes/player.routes.js";

const app = express();

app.use("/game", gameSessionRouter);
app.use("/player", playerRouter);

export default app;
