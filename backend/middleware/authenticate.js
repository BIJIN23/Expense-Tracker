const { findSessionByTokenHash } = require("../repositories/sessionRepository");
const { hashSessionToken } = require("../utils/sessionUtils");

function authenticate(req, res, next) {
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
    const session = findSessionByTokenHash(hashToken);

    if (!session) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const expiryDate = new Date(session.expires_at).getTime();
    if (!Number.isFinite(expiryDate) || expiryDate <= Date.now()) {
      return res.status(401).json({ message: "Authentication Required" });
    }
    req.userId = session.user_id;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { authenticate };
