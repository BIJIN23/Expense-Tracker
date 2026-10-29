const {
  findUserByEmail,
  createUser,
} = require("../repositories/userRepository");

const { hashPassword, verifyPassword } = require("../utils/passwordUtils");

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
    const existingUser = findUserByEmail(email);

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
      return res.status(401).json({ message: "User is not registered" });
    const passwordMatch = verifyPassword(password, existingUser.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
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

module.exports = { registerUser, loginUser };
