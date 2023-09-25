import { v4 as uuidv4 } from "uuid";
import Player from "../models/player.model.js";

export const createPlayer = async (req, res) => {
  try {
    const player = await Player.create({ ...req.body, id: uuidv4() });
    res.status(201).json({
      status: "success",
      data: {
        player,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
