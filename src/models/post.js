const { query } = require("../utils/database");


const createPost = async ({
  user_id,
  content,
  media_url,
  comments_enabled = true,
  scheduled_at = null,
}) => {
  const result = await query(
    `INSERT INTO posts (user_id, content, media_url, comments_enabled, scheduled_at, created_at, is_deleted)
     VALUES ($1, $2, $3, $4, $5, NOW(), false) -- Default is_deleted should be false
     RETURNING id, user_id, content, media_url, comments_enabled, scheduled_at, created_at`,
    [user_id, content, media_url, comments_enabled, scheduled_at]
  );
  return result.rows[0];
};

const getPostById = async (postId) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.id = $1`,
    [postId]
  );
  return result.rows[0] || null;
};

const getPostsByUserId = async (userId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.user_id = $1
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return result.rows;
};

const deletePost = async (postId, userId) => {
  const result = await query(
    `UPDATE posts SET is_deleted = true
     WHERE id = $1 AND user_id = $2`,
    [postId, userId]
  );
  return result.rowCount > 0;
};

const getFeedPosts = async (userId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT 
        p.*, 
        u.username, 
        u.full_name,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comment_count
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE (p.user_id = $1 OR p.user_id IN (
              SELECT followed_id FROM follows WHERE follower_id = $1
            ))
       AND (p.scheduled_at IS NULL OR p.scheduled_at <= NOW())
       AND p.is_deleted = false
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return result.rows;
};


const updatePost = async (postId, userId, updatedFields) => {
  const fields = [];
  const values = [];
  let i = 1;

  for (const key in updatedFields) {
    fields.push(`${key} = $${i++}`);
    values.push(updatedFields[key]);
  }

  if (fields.length === 0) return null;

  values.push(postId); 
  values.push(userId); 

  const queryText = `
    UPDATE posts
    SET ${fields.join(", ")}
    WHERE id = $${i++} AND user_id = $${i}
    RETURNING *;
  `;

  const result = await query(queryText, values);
  return result.rows[0] || null;
};

const searchPosts = async (queryText, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.content ILIKE '%' || $1 || '%'
       AND p.is_deleted = false
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [queryText, limit, offset]
  );
  return result.rows;
};

module.exports = {
  createPost,
  getPostById,
  getPostsByUserId,
  deletePost,
  getFeedPosts,
  searchPosts,
  updatePost,
};
