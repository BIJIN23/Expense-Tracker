const { db } = require("../database");

function findUserByEmail(email) {
  const statement = db.prepare(`SELECT * from users where email = ?`);
  const rows = statement.get(email);
  return rows;
}
function createUser(name, email, passwordHash) {
  const statement = db.prepare(
    `INSERT INTO users (name,email,password_hash) VALUES(?,?,?)`,
  );

  const result = statement.run(name, email, passwordHash);
  return result.lastInsertRowid;
}
function findUserById(userId) {
  const statement = db.prepare(
    `SELECT id , name, email FROM users WHERE id = ?`,
  );
  const userInfo = statement.get(userId);
  return userInfo;
}

module.exports = { findUserByEmail, createUser, findUserById };
