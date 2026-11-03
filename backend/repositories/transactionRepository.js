const { db } = require("../database");

function getTransactionsByUserId(userId) {
  const statement = db.prepare(
    `SELECT * FROM transactions WHERE user_id = ?  ORDER BY transaction_date DESC , id DESC`,
  );
  const rows = statement.all(userId);
  return rows;
}

function createTransaction(
  userId,
  title,
  amountCents,
  type,
  category,
  transactionDate,
) {
  const statement = db.prepare(
    `INSERT INTO transactions (user_id, title, amount_cents, type, category, transaction_date ) VALUES (?,?,?,?,?,?)`,
  );
  const rows = statement.run(
    userId,
    title,
    amountCents,
    type,
    category,
    transactionDate,
  );
  return rows.lastInsertRowid;
}
function getTransactionById(id, userid) {
  const statement = db.prepare(
    `SELECT * FROM transactions WHERE id = ? AND user_id = ? `,
  );
  const transaction = statement.get(id, userid);
  return transaction;
}
function updateTransactionById(
  transactionId,
  userId,
  title,
  amount_cents,
  type,
  category,
  transaction_date,
) {
  const statement = db.prepare(
    `UPDATE transactions SET
     title = ? ,
     amount_cents =? ,
     type = ? ,
     category=? ,
     transaction_date = ?
    WHERE id = ? AND user_id = ?`,
  );
  const transactionDetail = statement.run(
    title,
    amount_cents,
    type,
    category,
    transaction_date,
    transactionId,
    userId,
  );
  return transactionDetail.changes;
}
function deleteTransactionById(id, userid) {
  const statement = db.prepare(
    `DELETE FROM transactions WHERE id =? AND user_id = ? `,
  );
  const rows = statement.run(id, userid);
  return rows.changes;
}
function getTransactionSummary(userid) {
  const statement = db.prepare(
    `SELECT
        COALESCE(
          SUM(CASE WHEN type = 'income' THEN amount_cents ELSE 0 END),
          0
        ) AS totalIncomeCents,

        COALESCE(
          SUM(CASE WHEN type = 'expense' THEN amount_cents ELSE 0 END),
          0
        ) AS totalExpenseCents

      FROM transactions
      WHERE user_id = ?`,
  );
  const summary = statement.get(userid);
  return summary;
}
function getExpensesByCategory(userid) {
  const statement = db.prepare(
    `SELECT category, SUM(amount_cents) AS totalCents FROM transactions WHERE user_id = ? AND type = 'expense' GROUP BY  category ORDER BY totalCents DESC`,
  );
  const categoryExpense = statement.all(userid);
  return categoryExpense;
}
module.exports = {
  getTransactionsByUserId,
  createTransaction,
  getTransactionById,
  updateTransactionById,
  deleteTransactionById,
  getTransactionSummary,
  getExpensesByCategory,
};
