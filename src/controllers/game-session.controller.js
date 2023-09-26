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

/**
 * @desc Join a game session. If there is no free active game session,
 * then create a new game session.
 *
 * @returns the game session that user has joined
 */
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
        console.log(err);
        res.status(400).json({
          status: "error",
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
    console.log(err);
    res.status(400).json({
      status: "error",
      message: err,
    });
  }
};

/**
 * Leaves a game session. If there are two players in the game session,
 * then the player leaving automatically loses. If there is only one player
 * in the game session, then the player leaving leaves the game session and
 * the game is still active.
 *
 * @returns the game session which the user has left
 */
export const leaveSession = async (req, res) => {
  try {
    const { id, pid } = req.params;
    const gameSession = await GameSession.findOne({ id });

    // If game session does not exist, then return error.
    if (!gameSession) {
      return res.status(404).json({
        status: "error",
        message: "No game session found with that ID",
      });
    }

    const [playerOne, playerTwo] = gameSession.players;

    // If both players are in the game session, then the player leaving automatically loses.
    if (playerOne && playerTwo) {
      try {
        gameSession.winner = pid === playerOne ? playerTwo : playerOne;
        await gameSession.save();
        return res.status(200).json({
          status: "success",
          data: {
            gameSession,
          },
        });
      } catch (err) {
        console.log(err);
        res.status(400).json({
          status: "error",
          message: err,
        });
      }
    }

    // If only one player is in the game session, then player leaves and game is still active.
    try {
      gameSession.players = [null, null];
      await gameSession.save();
      return res.status(200).json({
        status: "success",
        data: {
          gameSession,
        },
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        status: "error",
        message: err,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({
      status: "error",
      message: e,
    });
  }
};
