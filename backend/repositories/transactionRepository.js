const { db } = require("../database");

function getTransactionById(userId) {
  const statement = db.prepare(`SELECT * FROM transactions WHERE user_id = ? `);
  const rows = statement.get(userId);
  return rows;
}

function createTransaction(userId, token, expiresAt) {
  const statement = db.prepare(
    `INSERT INTO transactions (user_id, token_hash, expires_at) VALUES (?,?,?)`,
  );
  const rows = statement.run(userId, token, expiresAt);
  return rows.lastInsertRowid;
}

module.exports = { getTransactionById, createTransaction };
