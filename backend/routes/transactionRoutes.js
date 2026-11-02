const express = require("express");
const { authenticate } = require("../middleware/authenticate");
const {
  addTransaction,
  getTransaction,
  getSingleTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
} = require("../controllers/transactionController");

const router = express.Router();

router.post("/", authenticate, addTransaction);
router.get("/", authenticate, getTransaction);
router.get("/:id", authenticate, getSingleTransaction);
router.put("/:id", authenticate, updateTransaction);
router.delete("/:id", authenticate, deleteTransaction);
router.get("/summary", authenticate, getSummary);

module.exports = router;
