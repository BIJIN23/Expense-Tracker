const { db } = require("../database");

function findUserByEmail(email) {
  const statement = db.prepare(`SELECT * from users where email = ?`);
  const rows = statement.get(email);
  console.log(rows);
  return rows;
}

function createUser(name, email, passwordHash) {
  const statement = db.prepare(
    `INSERT INTO users (name,email,password_hash) VALUES(?,?,?)`,
  );

  const result = statement.run(name, email, passwordHash);
  return result.lastInsertRowid;
}

module.exports = { findUserByEmail, createUser };
