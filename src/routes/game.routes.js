import express from "express";

const router = express.Router();

router.route("/").get((req, res) => {
  res.send("This is the game base router.");
});

export default router;
