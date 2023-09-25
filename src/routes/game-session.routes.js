import express from "express";
import {
  checkId,
  joinSession,
} from "../controllers/game-session.controller.js";

const router = express.Router();

router.param("id", checkId);

router.route("/").post(joinSession);

export default router;
