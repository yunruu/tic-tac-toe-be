import mongoose from "mongoose";
import app from "./app.js";

const DB = process.env.DATABASE;

mongoose.set("strictQuery", false);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("DB connection successful!");
  });

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
