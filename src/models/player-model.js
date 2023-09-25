const playerSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "A player must have an ID"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "A player must have a username"],
  },
});

const Player = mongoose.model("Player", playerSchema);

export default Player;
