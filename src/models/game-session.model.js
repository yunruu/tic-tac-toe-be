import mongoose from 'mongoose'

const gameSessionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'A game must have an ID'],
    unique: true,
  },
  players: {
    type: Array,
    required: [true, 'A game must have players'],
    default: [null, null],
  },
  board: {
    type: Array,
    required: [true, 'A game must have a gameboard'],
    default: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  turn: {
    type: Number,
    required: [true, "Each round of a game must have a different player's turn"],
    default: 1,
  },
  winner: {
    type: String,
  },
})

const GameSession = mongoose.model('GameSession', gameSessionSchema)

export default GameSession
