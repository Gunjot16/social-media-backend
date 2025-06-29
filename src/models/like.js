const { query } = require("../utils/database");

/**
 * Like a post (idempotent)
 */
const likePost = async (userId, postId) => {
	await query(
		`INSERT INTO likes (user_id, post_id)
		 VALUES ($1, $2)
		 ON CONFLICT DO NOTHING`,
		[userId, postId]
	);
};

/**
 * Unlike a post
 */
const unlikePost = async (userId, postId) => {
	await query(
		`DELETE FROM likes WHERE user_id = $1 AND post_id = $2`,
		[userId, postId]
	);
};

/**
 * Get like count for a post
 */
const getPostLikes = async (postId) => {
	const result = await query(
		`SELECT COUNT(*) FROM likes WHERE post_id = $1`,
		[postId]
	);
	return parseInt(result.rows[0].count);
};

/**
 * Get all liked posts of a user
 */
const getUserLikes = async (userId) => {
	const result = await query(
		`SELECT post_id FROM likes WHERE user_id = $1`,
		[userId]
	);
	return result.rows.map(row => row.post_id);
};

/**
 * Check if user liked a post
 */
const hasUserLikedPost = async (userId, postId) => {
	const result = await query(
		`SELECT 1 FROM likes WHERE user_id = $1 AND post_id = $2`,
		[userId, postId]
	);
	return result.rowCount > 0;
};

module.exports = {
	likePost,
	unlikePost,
	getPostLikes,
	getUserLikes,
	hasUserLikedPost,
};
