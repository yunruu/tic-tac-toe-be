import express from "express";
import {
  checkId,
  createGameSession,
} from "../controllers/game-session.controller.js";

const router = express.Router();

router.param("id", checkId);

router.route("/").post(createGameSession);

export default router;
