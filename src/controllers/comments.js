const {
  createComment,
  updateComment,
  deleteComment,
  getPostComments,
} = require("../models/comment");

const logger = require("../utils/logger");

const createCommentController = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const user_id = req.user.id;

    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Comment content is required." });
    }

    const comment = await createComment({ user_id, post_id: postId, content });

    return res.status(201).json({
      message: "Comment created successfully",
      comment,
    });
  } catch (error) {
    logger.error("Error creating comment:", error);
    return res.status(500).json({ error: "Failed to create comment" });
  }
};

const updateCommentController = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const user_id = req.user.id;

    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Updated content is required." });
    }

    const updated = await updateComment({
      comment_id: commentId,
      user_id,
      newContent: content,
    });

    if (!updated) {
      return res
        .status(403)
        .json({ error: "Comment not found or not authorized." });
    }

    return res.json({
      message: "Comment updated successfully",
      updated,
    });
  } catch (error) {
    logger.error("Error updating comment:", error);
    return res.status(500).json({ error: "Failed to update comment" });
  }
};

const deleteCommentController = async (req, res) => {
  try {
    const { commentId } = req.params;
    const user_id = req.user.id;

    const success = await deleteComment(commentId, user_id);

    if (!success) {
      return res
        .status(403)
        .json({ error: "Comment not found or not authorized." });
    }

    return res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    logger.error("Error deleting comment:", error);
    return res.status(500).json({ error: "Failed to delete comment" });
  }
};

const getPostCommentsController = async (req, res) => {
  try {
    const { postId } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const comments = await getPostComments(postId, limit, offset);

    return res.json({ comments });
  } catch (error) {
    logger.error("Error fetching comments:", error);
    return res.status(500).json({ error: "Failed to fetch post comments" });
  }
};

module.exports = {
  createComment: createCommentController,
  updateComment: updateCommentController,
  deleteComment: deleteCommentController,
  getPostComments: getPostCommentsController,
};
