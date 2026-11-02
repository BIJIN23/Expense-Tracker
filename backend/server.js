const express = require("express");
const cookieParser = require("cookie-parser");
require("./database");
const authRoutes = require("./routes/authRoutes");
const { errorHandler } = require("./middleware/errorHandler");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();
const port = 5000;

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "expense Tracker API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Sever is listening on port  ${port}`);
});
