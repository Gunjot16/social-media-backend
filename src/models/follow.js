const { query } = require("../utils/database");

/**
 * Follow a user
 */
const followUser = async (followerId, followeeId) => {
  await query(
    `INSERT INTO follows (follower_id, followee_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [followerId, followeeId]
  );
};

/**
 * Unfollow a user
 */
const unfollowUser = async (followerId, followeeId) => {
  await query(
    `DELETE FROM follows WHERE follower_id = $1 AND followee_id = $2`,
    [followerId, followeeId]
  );
};

/**
 * Check if already following
 */
const checkIfFollowing = async (followerId, followeeId) => {
  const result = await query(
    `SELECT 1 FROM follows WHERE follower_id = $1 AND followee_id = $2`,
    [followerId, followeeId]
  );
  return result.rowCount > 0;
};

/**
 * Get users the current user is following
 */
const getFollowing = async (userId) => {
  const result = await query(
    `SELECT u.id, u.username, u.full_name, u.email
     FROM users u
     JOIN follows f ON u.id = f.followee_id
     WHERE f.follower_id = $1`,
    [userId]
  );
  return result.rows;
};

/**
 * Get followers of the current user
 */
const getFollowers = async (userId) => {
  const result = await query(
    `SELECT u.id, u.username, u.full_name, u.email
     FROM users u
     JOIN follows f ON u.id = f.follower_id
     WHERE f.followee_id = $1`,
    [userId]
  );
  return result.rows;
};

/**
 * Get follow stats (followers & following count)
 */
const getFollowCounts = async (userId) => {
  const result = await query(
    `SELECT
      (SELECT COUNT(*) FROM follows WHERE follower_id = $1) AS following_count,
      (SELECT COUNT(*) FROM follows WHERE followee_id = $1) AS followers_count`,
    [userId]
  );
  return result.rows[0];
};

/**
 * Count followers
 */
const countFollowers = async (userId) => {
  const result = await query(
    "SELECT COUNT(*) FROM follows WHERE followee_id = $1",
    [userId]
  );
  return parseInt(result.rows[0].count, 10);
};

/**
 * Count following
 */
const countFollowing = async (userId) => {
  const result = await query(
    "SELECT COUNT(*) FROM follows WHERE follower_id = $1",
    [userId]
  );
  return parseInt(result.rows[0].count, 10);
};

module.exports = {
  followUser,
  unfollowUser,
  checkIfFollowing,
  getFollowing,
  getFollowers,
  getFollowCounts,
  countFollowers,
  countFollowing,
};
