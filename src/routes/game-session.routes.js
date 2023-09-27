import express from "express";
import {
  getBoard,
  joinSession,
  leaveSession,
  makeMove,
} from "../controllers/game-session.controller.js";

const router = express.Router();

router.route("/").post(joinSession);
router.route("/:id").get(getBoard);
router.route("/:id/:pid").patch(leaveSession);
router.route("/board/:id/:pid").patch(makeMove);

export default router;
