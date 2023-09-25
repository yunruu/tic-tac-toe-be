import express from "express";
import { checkId } from "../controllers/game-session.controller.js";

const router = express.Router();

router.param("id", checkId);

router.route("/").get((req, res) => {
  res.send("This is the game base router.");
});

export default router;
