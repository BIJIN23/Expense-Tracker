const {
  findUserByEmail,
  createUser,
  findUserById,
} = require("../repositories/userRepository");
const { hashPassword, verifyPassword } = require("../utils/passwordUtils");
const {
  generateSessionToken,
  hashSessionToken,
} = require("../utils/sessionUtils");
const {
  createSession,
  deleteSessionByTokenHash,
} = require("../repositories/sessionRepository");

function registerUser(req, res, next) {
  try {
    const { name, email, password } = req.body ?? {};

    if (
      typeof name !== "string" ||
      name.trim() === "" ||
      typeof email !== "string" ||
      email.trim() === "" ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        message: "Invalid registration details",
      });
    }
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = findUserByEmail(normalizedEmail);

    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }
    const hashedPassword = hashPassword(password);
    const userId = createUser(normalizedName, normalizedEmail, hashedPassword);
    return res.status(201).json({
      id: Number(userId),
      name: normalizedName,
      email: normalizedEmail,
    });
  } catch (error) {
    next(error);
  }
}
function loginUser(req, res, next) {
  try {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== "string" ||
      email.trim() === "" ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = findUserByEmail(normalizedEmail);
    if (!existingUser)
      return res.status(401).json({ message: "Invalid email or password" });
    const passwordMatch = verifyPassword(password, existingUser.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const sessionsToken = generateSessionToken();
    const sessionTokenHash = hashSessionToken(sessionsToken);
    const expiryDate = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ).toISOString();

    createSession(existingUser.id, sessionTokenHash, expiryDate);

    res.cookie("session_token", sessionsToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });
    return res.status(200).json({
      message: "logined in Successfully",
      user: {
        name: existingUser.name,
        id: existingUser.id,
        email: existingUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
}
function getCurrentUser(req, res, next) {
  try {
    const userId = req.userId;
    const currentUser = findUserById(userId);
    if (!currentUser) {
      return res.status(401).json({ message: "User does not exists" });
    }
    return res.status(200).json({ user: currentUser });
  } catch (error) {
    next(error);
  }
}
function logoutUser(req, res, next) {
  try {
    const sessionToken = req.cookies?.session_token;

    if (
      typeof sessionToken !== "string" ||
      !/^[a-f0-9]{64}$/.test(sessionToken)
    ) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }
    const hashToken = hashSessionToken(sessionToken);
    deleteSessionByTokenHash(hashToken);
    res.clearCookie("session_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({ message: "Logged out" });
  } catch (error) {
    next(error);
  }
}

module.exports = { registerUser, loginUser, getCurrentUser, logoutUser };
