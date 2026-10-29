const crypto = require("node:crypto");

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");

  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedpassword) {
  const [storedSalt, storedhash] = storedpassword.split(":");

  const currentpasswordbuffer = crypto.scryptSync(password, storedSalt, 64);
  const storedpasswordbuffer = Buffer.from(storedhash, "hex");

  if (currentpasswordbuffer.length !== storedpasswordbuffer.length)
    return false;
  const result = crypto.timingSafeEqual(
    currentpasswordbuffer,
    storedpasswordbuffer,
  );

  return result;
}
module.exports = { hashPassword, verifyPassword };
