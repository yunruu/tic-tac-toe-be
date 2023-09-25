import GameSession from "../models/game-session.model.js";
import { v4 as uuidv4 } from "uuid";

export const activeGameSessions = (req, res) => {
  res.status(500).json({
    status: "error",
    message:
      "This route should return all active game sessions in an array, but is not yet defined!",
  });
};

export const checkId = (req, res, next, val) => {
  if (req.params.id === "1") {
    return res.status(400).json({
      status: "error",
      message: "This is not the correct ID!",
    });
  }
  next();
};

export const createGameSession = async (req, res) => {
  try {
    const id = uuidv4();
    const newGameSession = await GameSession.create({ ...req.body, id });

    res.status(201).json({
      status: "success",
      data: {
        gameSession: newGameSession,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
