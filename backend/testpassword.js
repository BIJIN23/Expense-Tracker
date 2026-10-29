const { findUserByEmail } = require("./repositories/userRepository");
const { hashPassword, verifyPassword } = require("./utils/passwordUtils");
const {
  generateSessionToken,
  hashSessionToken,
} = require("./utils/sessionUtils");

const firsthash = hashPassword("Bijin@2003");

console.log(verifyPassword("Bijin@2001", firsthash));

console.log(findUserByEmail("john@example.com").password_hash);

const token = generateSessionToken();
const tokenHash = hashSessionToken(token);

console.log(token); // 64 hexadecimal characters
console.log(tokenHash); // 64 hexadecimal characters
