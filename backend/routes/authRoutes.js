const express = require("express");
const {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
} = require("../controllers/authController");
const { authenticate } = require("../middleware/authenticate");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authenticate, getCurrentUser);
router.post("/logout", authenticate, logoutUser);

module.exports = router;
