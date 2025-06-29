const { verifyToken } = require("../utils/jwt");
const { getUserById } = require("../models/user");
const logger = require("../utils/logger");


const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({ error: "Authorization token is missing." });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    const decodedPayload = verifyToken(token);
    const user = await getUserById(decodedPayload.userId);

    if (!user) {
      return res.status(401).json({ error: "User associated with token not found." });
    }

    req.user = user;
    next();

  } catch (error) {
    logger.critical("Token verification failed:", error.message);
    return res.status(403).json({ error: "Invalid or expired access token." });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (authHeader) {
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;

      const decodedPayload = verifyToken(token);
      const user = await getUserById(decodedPayload.userId);

      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth,
};
