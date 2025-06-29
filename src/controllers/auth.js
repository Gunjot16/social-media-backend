const {
  createUser,
  getUserByUsername,
  verifyPassword,
} = require("../models/user");

const { generateToken } = require("../utils/jwt");
const logger = require("../utils/logger");

const register = async (req, res) => {
  try {
    const { username, email, password, full_name } = req.validatedData;

    const user = await createUser({ username, email, password, full_name });

    const token = generateToken({
      userId: user.id,
      username: user.username,
    });

    logger.verbose(`User registered: ${username}`);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
      },
      token,
    });
  } catch (error) {
    logger.critical("Error during registration:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.validatedData;

    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken({
      userId: user.id,
      username: user.username,
    });

    logger.verbose(`User logged in: ${username}`);

    return res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
      },
      token,
    });
  } catch (error) {
    logger.critical("Error during login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = req.user;

    return res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    logger.critical("Error fetching user profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
