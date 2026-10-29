const { DatabaseSync } = require("node:sqlite");
const fs = require("node:fs");
const path = require("node:path");

const databasePath = path.join(__dirname, "expense.db");
const schemaPath = path.join(__dirname, "schema.sql");

const db = new DatabaseSync(databasePath);
db.exec("PRAGMA foreign_keys = ON");

const schema = fs.readFileSync(schemaPath, "utf8");

db.exec(schema);

module.exports = { db };
