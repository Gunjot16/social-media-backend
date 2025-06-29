const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const commentController = require("../controllers/comments");

const router = express.Router();


// Create a comment on a post
router.post("/posts/:postId/comments", authenticateToken, commentController.createComment);

// Update a comment (only by the owner)
router.put("/comments/:commentId", authenticateToken, commentController.updateComment);

// Delete a comment (only by the owner)
router.delete("/comments/:commentId", authenticateToken, commentController.deleteComment);

// Get comments for a specific post (public)
router.get("/posts/:postId/comments", commentController.getPostComments);

module.exports = router;
