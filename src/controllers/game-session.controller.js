import GameSession from "../models/game-session.model.js";
import { v4 as uuidv4 } from "uuid";

export const checkId = (req, res, next, val) => {
  if (req.params.id === "1") {
    return res.status(400).json({
      status: "error",
      message: "This is not the correct ID!",
    });
  }
  next();
};

export const joinSession = async (req, res) => {
  try {
    const gameSession = await GameSession.findOne({
      players: { $in: [null] },
    });

    if (!gameSession) {
      try {
        const newGameSession = await GameSession.create({ id: uuidv4() });
        const newPlayers = [req.body.pid, null];
        newGameSession.players = newPlayers;
        await newGameSession.save();
        return res.status(201).json({
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
    } else {
      if (gameSession.players[0] === null) {
        const newPlayers = [req.body.pid, null];
        gameSession.players = newPlayers;
      } else {
        const newPlayers = [...gameSession.players];
        newPlayers[1] = req.body.pid;
        gameSession.players = newPlayers;
      }
      await gameSession.save();
      res.status(200).json({
        status: "success",
        data: {
          gameSession,
        },
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
