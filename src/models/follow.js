const { query } = require('../utils/database');

// Follow a user
exports.followUser = async (followerId, followedId) => {
  await query(
    `INSERT INTO follows (follower_id, followed_id) VALUES ($1, $2)`,
    [followerId, followedId]
  );
};

// Unfollow a user
exports.unfollowUser = async (followerId, followedId) => {
  await query(
    `DELETE FROM follows WHERE follower_id = $1 AND followed_id = $2`,
    [followerId, followedId]
  );
};

// Check if one user is following another
exports.checkIfFollowing = async (followerId, followedId) => {
  const result = await query(
    `SELECT 1 FROM follows WHERE follower_id = $1 AND followed_id = $2`,
    [followerId, followedId]
  );
  return result.rowCount > 0;
};

// Get list of users this user is following
exports.getFollowing = async (userId) => {
  const result = await query(
    `SELECT u.id, u.username, u.full_name
     FROM follows f
     JOIN users u ON f.followed_id = u.id
     WHERE f.follower_id = $1`,
    [userId]
  );
  return result.rows;
};

// Get list of users following this user
exports.getFollowers = async (userId) => {
  const result = await query(
    `SELECT u.id, u.username, u.full_name
     FROM follows f
     JOIN users u ON f.follower_id = u.id
     WHERE f.followed_id = $1`,
    [userId]
  );
  return result.rows;
};

// Get follow counts (followers and following)
exports.getFollowCounts = async (userId) => {
  const followersRes = await query(
    `SELECT COUNT(*) AS followers FROM follows WHERE followed_id = $1`,
    [userId]
  );
  const followingRes = await query(
    `SELECT COUNT(*) AS following FROM follows WHERE follower_id = $1`,
    [userId]
  );
  return {
    followers: parseInt(followersRes.rows[0].followers),
    following: parseInt(followingRes.rows[0].following),
  };
};

// For user profile counts
exports.countFollowers = async (userId) => {
  const result = await query(
    `SELECT COUNT(*) AS total FROM follows WHERE followed_id = $1`,
    [userId]
  );
  return parseInt(result.rows[0].total);
};

exports.countFollowing = async (userId) => {
  const result = await query(
    `SELECT COUNT(*) AS total FROM follows WHERE follower_id = $1`,
    [userId]
  );
  return parseInt(result.rows[0].total);
};
