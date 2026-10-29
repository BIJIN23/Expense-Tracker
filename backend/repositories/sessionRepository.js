const { db } = require("../database");

function createSession(userId, tokenHash, expiresAT) {
  const statement = db.prepare(
    `INSERT INTO sessions (user_id, token_hash, expires_at) VALUES(?, ?, ?)`,
  );
  const rows = statement.run(userId, tokenHash, expiresAT);
  return rows.lastInsertRowid;
}

function getSession(tokenHash) {
  const statement = db.prepare(`SELECT * FROM sessions WHERE token_hash = ? `);

  const rows = statement.get(tokenHash);
  return rows;
}
module.exports = { createSession, getSession };
