import express from "express";
import {
  joinSession,
  leaveSession,
  makeMove,
} from "../controllers/game-session.controller.js";

const router = express.Router();

router.route("/").post(joinSession);
router.route("/:id/:pid").patch(leaveSession);
router.route("/board/:id/:pid").put(makeMove);

export default router;
