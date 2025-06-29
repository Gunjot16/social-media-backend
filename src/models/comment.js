const { query } = require("../utils/database");


const createComment = async ({ user_id, post_id, content }) => {
	const result = await query(
		`INSERT INTO comments (user_id, post_id, content, created_at)
		 VALUES ($1, $2, $3, NOW())
		 RETURNING id, user_id, post_id, content, created_at`,
		[user_id, post_id, content]
	);
	return result.rows[0];
};

const updateComment = async ({ comment_id, user_id, newContent }) => {
	const result = await query(
		`UPDATE comments
		 SET content = $1, updated_at = NOW()
		 WHERE id = $2 AND user_id = $3
		 RETURNING id, content, updated_at`,
		[newContent, comment_id, user_id]
	);
	return result.rows[0] || null;
};


const deleteComment = async (comment_id, user_id) => {
	const result = await query(
		`DELETE FROM comments
		 WHERE id = $1 AND user_id = $2`,
		[comment_id, user_id]
	);
	return result.rowCount > 0;
};


const getPostComments = async (post_id, limit = 50, offset = 0) => {
	const result = await query(
		`SELECT c.*, u.username, u.full_name
		 FROM comments c
		 JOIN users u ON c.user_id = u.id
		 WHERE c.post_id = $1
		 ORDER BY c.created_at ASC
		 LIMIT $2 OFFSET $3`,
		[post_id, limit, offset]
	);
	return result.rows;
};


const getCommentById = async (comment_id) => {
	const result = await query(
		`SELECT * FROM comments WHERE id = $1`,
		[comment_id]
	);
	return result.rows[0] || null;
};

module.exports = {
	createComment,
	updateComment,
	deleteComment,
	getPostComments,
	getCommentById,
};
