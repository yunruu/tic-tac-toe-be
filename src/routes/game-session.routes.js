import express from "express";
import {
  joinSession,
  leaveSession,
} from "../controllers/game-session.controller.js";

const router = express.Router();

router.route("/").post(joinSession);
router.route("/:id/:pid").patch(leaveSession);

export default router;
