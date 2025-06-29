const {
  createPost,
  getPostById,
  getPostsByUserId,
  deletePost,
  getFeedPosts,
  updatePost,
} = require("../models/post.js");

const logger = require("../utils/logger");

const create = async (req, res) => {
  try {
    const { content, media_url, comments_enabled, scheduled_at } = req.validatedData;
    const userId = req.user.id;

    const post = await createPost({
      user_id: userId,
      content,
      media_url,
      comments_enabled,
      scheduled_at,
    });

    logger.verbose(`User ${userId} created post ${post.id}`);
    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    logger.critical("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getById = async (req, res) => {
  try {
    const { post_id } = req.params;
    const post = await getPostById(parseInt(post_id));

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ post });
  } catch (error) {
    logger.critical("Error fetching post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { user_id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const posts = await getPostsByUserId(parseInt(user_id), limit, offset);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        hasMore: posts.length === limit,
      },
    });
  } catch (error) {
    logger.critical("Error fetching user's posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMyPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const posts = await getPostsByUserId(userId, limit, offset);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        hasMore: posts.length === limit,
      },
    });
  } catch (error) {
    logger.critical("Error fetching your posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getFeed = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const posts = await getFeedPosts(userId, limit, offset);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        hasMore: posts.length === limit,
      },
    });
  } catch (error) {
    logger.critical("Error fetching feed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const remove = async (req, res) => {
  try {
    const { post_id } = req.params;
    const userId = req.user.id;

    const success = await deletePost(parseInt(post_id), userId);
    if (!success) {
      return res.status(404).json({ error: "Post not found or you're not authorized" });
    }

    logger.verbose(`User ${userId} deleted post ${post_id}`);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    logger.critical("Error deleting post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const update = async (req, res) => {
  try {
    const { post_id } = req.params;
    const userId = req.user.id;
    const updates = req.validatedData;

    const updated = await updatePost(parseInt(post_id), userId, updates);

    if (!updated) {
      return res.status(404).json({ error: "Post not found or you're not authorized" });
    }

    logger.verbose(`User ${userId} updated post ${post_id}`);
    res.json({ message: "Post updated successfully", post: updated });
  } catch (error) {
    logger.critical("Error updating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  create,
  getById,
  getUserPosts,
  getMyPosts,
  getFeed,
  remove,
  update,
};
