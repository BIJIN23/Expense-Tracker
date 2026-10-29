const crypto = require("node:crypto");

function generateSessionToken() {
  const sessionsToken = crypto.randomBytes(32).toString("hex");
  return sessionsToken;
}
function hashSessionToken(token) {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  return tokenHash;
}
module.exports = { generateSessionToken, hashSessionToken };
