import app from "./app.js";

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
