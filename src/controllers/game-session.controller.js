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
