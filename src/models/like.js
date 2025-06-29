const { query } = require("../utils/database");


const likePost = async (userId, postId) => {
	await query(
		`INSERT INTO likes (user_id, post_id)
		 VALUES ($1, $2)
		 ON CONFLICT DO NOTHING`,
		[userId, postId]
	);
};


const unlikePost = async (userId, postId) => {
	await query(
		`DELETE FROM likes
		 WHERE user_id = $1 AND post_id = $2`,
		[userId, postId]
	);
};


const getPostLikes = async (postId) => {
	const result = await query(
		`SELECT COUNT(*) FROM likes
		 WHERE post_id = $1`,
		[postId]
	);
	return parseInt(result.rows[0].count, 10);
};


const getUserLikes = async (userId) => {
	const result = await query(
		`SELECT post_id FROM likes
		 WHERE user_id = $1`,
		[userId]
	);
	return result.rows.map(row => row.post_id);
};


const hasUserLikedPost = async (userId, postId) => {
	const result = await query(
		`SELECT 1 FROM likes
		 WHERE user_id = $1 AND post_id = $2`,
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
