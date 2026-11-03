const {
  createTransaction,
  getTransactionsByUserId,
  getTransactionById,
  updateTransactionById,
  deleteTransactionById,
  getTransactionSummary,
  getExpensesByCategory,
} = require("../repositories/transactionRepository");

function addTransaction(req, res, next) {
  try {
    const { title, amount, type, category, transaction_date } = req.body ?? {};
    const userId = req.userId;

    if (
      typeof title !== "string" ||
      title.trim() === "" ||
      typeof amount !== "number" ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      (type !== "income" && type !== "expense") ||
      typeof category !== "string" ||
      category.trim() === "" ||
      typeof transaction_date !== "string"
    ) {
      return res.status(400).json({
        message: "Invalid transaction data",
      });
    }

    const dateFormat = /^\d{4}-\d{2}-\d{2}$/;

    const validDate =
      dateFormat.test(transaction_date) &&
      !Number.isNaN(Date.parse(`${transaction_date}T00:00:00Z`)) &&
      new Date(`${transaction_date}T00:00:00Z`).toISOString().slice(0, 10) ===
        transaction_date;

    if (!validDate) {
      return res.status(400).json({
        message: "Invalid transaction date",
      });
    }
    const amountCents = Math.round(amount * 100);
    if (
      !Number.isSafeInteger(amountCents) ||
      amountCents <= 0 ||
      Math.abs(amount * 100 - amountCents) > 1e-7
    ) {
      return res.status(400).json({
        message: "Amount must have at most two decimal places",
      });
    }

    const transactionId = createTransaction(
      userId,
      title,
      amountCents,
      type,
      category,
      transaction_date,
    );

    return res.status(201).json({
      message: "The transction has been registered",
      id: transactionId,
    });
  } catch (error) {
    next(error);
  }
}
function getTransaction(req, res, next) {
  try {
    const userId = req.userId;

    const transactions = getTransactionsByUserId(userId);
    return res.status(200).json({
      message: "All transactions are successful",
      transactions: transactions,
    });
  } catch (error) {
    next(error);
  }
}
function getSingleTransaction(req, res, next) {
  try {
    const transactionId = Number(req.params.id);
    const userId = req.userId;

    if (!Number.isSafeInteger(transactionId) || transactionId <= 0) {
      return res.status(400).json({ message: "Invalid Transaction ID" });
    }
    const transactionDetails = getTransactionById(transactionId, userId);
    if (!transactionDetails) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    return res.status(200).json({
      message: "Transaction found",
      transactionDetails: transactionDetails,
    });
  } catch (error) {
    next(error);
  }
}
function updateTransaction(req, res, next) {
  try {
    const transactionId = Number(req.params.id);
    const userId = req.userId;

    const { title, amount, type, category, transaction_date } = req.body ?? {};

    if (!Number.isSafeInteger(transactionId) || transactionId <= 0) {
      return res.status(400).json({ message: "Invalid Transaction ID" });
    }
    if (
      typeof title !== "string" ||
      title.trim() === "" ||
      typeof amount !== "number" ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      (type !== "income" && type !== "expense") ||
      typeof category !== "string" ||
      category.trim() === "" ||
      typeof transaction_date !== "string"
    ) {
      return res.status(400).json({
        message: "Invalid transaction data",
      });
    }

    const dateFormat = /^\d{4}-\d{2}-\d{2}$/;

    const validDate =
      dateFormat.test(transaction_date) &&
      !Number.isNaN(Date.parse(`${transaction_date}T00:00:00Z`)) &&
      new Date(`${transaction_date}T00:00:00Z`).toISOString().slice(0, 10) ===
        transaction_date;

    if (!validDate) {
      return res.status(400).json({
        message: "Invalid transaction date",
      });
    }
    const amountCents = Math.round(amount * 100);
    if (
      !Number.isSafeInteger(amountCents) ||
      amountCents <= 0 ||
      Math.abs(amount * 100 - amountCents) > 1e-7
    ) {
      return res.status(400).json({
        message: "Amount must have at most two decimal places",
      });
    }

    const updatedTransaction = updateTransactionById(
      transactionId,
      userId,
      title,
      amountCents,
      type,
      category,
      transaction_date,
    );
    if (updatedTransaction === 0) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      message: "The Transaction is updated",
      updatedTransaction: updatedTransaction,
    });
  } catch (error) {
    next(error);
  }
}
function deleteTransaction(req, res, next) {
  try {
    const transactionId = Number(req.params.id);
    const userId = req.userId;

    if (!Number.isSafeInteger(transactionId) || transactionId <= 0) {
      return res.status(400).json({ message: "Invalid Transaction ID" });
    }
    const deleteTransaction = deleteTransactionById(transactionId, userId);
    if (deleteTransaction === 0) {
      return res.status(404).json({ message: "Data not found" });
    }
    return res.status(200).json({ message: "Deleted the Transaction" });
  } catch (error) {
    next(error);
  }
}
function getSummary(req, res, next) {
  try {
    const userId = req.userId;
    const summary = getTransactionSummary(userId);
    const totalIncomeCents = summary.totalIncomeCents;
    const totalExpenseCents = summary.totalExpenseCents;

    const balanceCents = totalIncomeCents - totalExpenseCents;
    return res.status(200).json({
      totalIncomeCents: totalIncomeCents,
      totalExpenseCents: totalExpenseCents,
      balanceCents: balanceCents,
    });
  } catch (error) {
    next(error);
  }
}

function getCategorySummary(req, res, next) {
  try {
    const userId = req.userId;
    const categories = getExpensesByCategory(userId);

    return res.status(200).json({
      categories: categories,
    });
  } catch (error) {
    next(error);
  }
}
module.exports = {
  addTransaction,
  getTransaction,
  getSingleTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
  getCategorySummary,
};
