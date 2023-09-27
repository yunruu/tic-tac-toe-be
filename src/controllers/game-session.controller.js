import Player from "../models/player.model.js";
import GameSession from "../models/game-session.model.js";
import { v4 as uuidv4 } from "uuid";

/**
 * @desc Join a game session. If there is no free active game session,
 * then create a new game session.
 *
 * @returns the game session that user has joined
 */
export const joinSession = async (req, res) => {
  try {
    const { pid } = req.body;
    const username = (await Player.findOne({ id: pid })).username;
    const gameSession = await GameSession.findOne({
      players: { $in: [null] },
    });

    if (!gameSession) {
      try {
        const newGameSession = await GameSession.create({ id: uuidv4() });
        const newPlayers = [{ pid, username }, null];
        newGameSession.players = newPlayers;
        await newGameSession.save();
        return res.status(201).json({
          gameSession: newGameSession,
        });
      } catch (err) {
        console.log("creating new game session: ", err);
        return res.status(400).json({
          message: err,
        });
      }
    } else {
      try {
        if (gameSession.players[0] === null) {
          const newPlayers = [{ pid, username }, null];
          gameSession.players = newPlayers;
        } else {
          const newPlayers = [...gameSession.players];
          newPlayers[1] = { pid, username };
          gameSession.players = newPlayers;
          gameSession.turn = 1;
        }
        await gameSession.save();
        res.status(200).json({
          gameSession,
        });
      } catch (err) {
        console.log("joining existing game session: ", err);
        res.status(400).json({
          message: err,
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
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
        gameSession.winner = pid === playerOne.pid ? playerTwo : playerOne;
        await gameSession.save();
        return res.status(200).json({
          gameSession,
        });
      } catch (err) {
        console.log(err);
        return res.status(400).json({
          message: err,
        });
      }
    }

    // If only one player is in the game session, then player leaves and game is still active.
    try {
      gameSession.players = [null, null];
      await gameSession.save();
      return res.status(200).json({
        gameSession,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({
      message: e,
    });
  }
};

/**
 * @desc Checks if the move is valid.
 *
 * @param {Array} board - the game board
 * @returns true if the move is valid, false otherwise
 */
const isValidMove = (board) => {
  const oneCount = board.filter((element) => element === 1).length;
  const twoCount = board.filter((element) => element === 2).length;

  if (oneCount - twoCount > 1 || twoCount - oneCount > 1) {
    return false;
  }

  return true;
};

/**
 * @desc Checks if the board is a winning board.
 *
 * @param {Array} board the board to check
 * @param {number} turn the player whose turn it is
 * @returns true if the board is a winning board, false otherwise
 */
const isWinningBoard = (board, turn) => {
  const winningBoards = [
    [1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 1],

    [1, 0, 0, 1, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 1, 0, 0, 1],

    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [0, 0, 1, 0, 1, 0, 1, 0, 0],
  ];

  // Convert board to 1s and 0s, with 1 being the player's moves.
  const parsedBoard = board.map((cell) => {
    if (cell === turn) {
      return 1;
    } else {
      return 0;
    }
  });

  for (let i = 0; i < winningBoards.length; i++) {
    const winningBoard = winningBoards[i];
    for (let j = 0; j < winningBoard.length; j++) {
      if (winningBoard[j] !== parsedBoard[j]) {
        break;
      }
      // If we reach the end of the winning board, then player has won.
      if (j === winningBoard.length - 1) {
        return true;
      }
    }
  }

  return false;
};

/**
 * @desc Updates the game session with the player's move.
 *
 * @returns the updated game session
 */
export const makeMove = async (req, res) => {
  try {
    const { id, pid } = req.params;
    const { board } = req.body;

    if (!board) {
      return res.status(400).json({
        message: "No board provided",
      });
    }

    if (board.length !== 9) {
      return res.status(400).json({
        message: "Board must have 9 elements",
      });
    }

    const gameSession = await GameSession.findOne({ id });

    if (!gameSession) {
      return res.status(404).json({
        message: "No game session found with that ID",
      });
    }

    if (gameSession.winner) {
      return res.status(400).json({
        message: "Game is already over",
      });
    }

    if (gameSession.board[gameSession.turn - 1] !== pid) {
      return res.status(400).json({
        status: "error",
        message: "It is not yet your turn",
      });
    }

    const isValid = isValidMove(board);
    if (!isValid) {
      return res.status(400).json({
        message: "Invalid move",
      });
    }

    const isWinning = isWinningBoard(board, gameSession.turn);
    if (isWinning) {
      gameSession.winner = pid;
      await gameSession.save();
      return res.status(200).json({
        gameSession,
      });
    } else {
      gameSession.board = board;
      gameSession.turn = gameSession.turn === 1 ? 2 : 1;
      await gameSession.save();
      return res.status(200).json({
        gameSession,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({
      message: e,
    });
  }
};

/**
 * @desc Gets the board of the game session.
 *
 * @returns the board of the game session
 */
export const getBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const gameSession = await GameSession.findOne({ id });
    if (!gameSession) {
      return res.status(404).json({
        message: "No game session found with that ID",
      });
    }
    return res.status(200).json({
      board: gameSession.board,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      message: e,
    });
  }
};
