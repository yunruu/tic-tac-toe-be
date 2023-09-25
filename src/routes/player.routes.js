import express from "express";

const router = express.Router();

router.route("/").get((req, res) => {
  res.send("This is the player base router.");
});

export default router;
