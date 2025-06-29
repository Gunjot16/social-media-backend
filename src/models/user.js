const { query } = require("../utils/database");
const bcrypt = require("bcryptjs");

/**
 * Create a new user
 */
const createUser = async ({ username, email, password, full_name }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await query(
    `INSERT INTO users (username, email, password_hash, full_name, created_at)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING id, username, email, full_name, created_at`,
    [username, email, hashedPassword, full_name]
  );

  return result.rows[0];
};

/**
 * Find user by username
 */
const getUserByUsername = async (username) => {
  const result = await query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return result.rows[0] || null;
};

/**
 * Find user by ID
 */
const getUserById = async (id) => {
  const result = await query(
    "SELECT id, username, full_name, created_at FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
};

/**
 * Verify user password
 */
const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  createUser,
  getUserByUsername,
  getUserById,
  verifyPassword,
  
};
