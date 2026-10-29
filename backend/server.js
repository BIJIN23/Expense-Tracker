const express = require("express");
require("./database");
const authRoutes = require("./routes/authRoutes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
const port = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "expense Tracker API is running" });
});

app.use("/api/auth", authRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Sever is listening on port  ${port}`);
});
