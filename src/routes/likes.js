const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const {
	likePost,
	unlikePost,
	getPostLikes,
	getUserLikes,
	hasUserLiked,
} = require("../controllers/likes");
const { validatePostExists } = require("../utils/validation");

const router = express.Router();



// Like a post
router.post("/post/:postId/like", authenticateToken, validatePostExists, likePost);

// Unlike a post
router.delete("/post/:postId/like", authenticateToken, validatePostExists, unlikePost);

// Get total likes for a post
router.get("/post/:postId", getPostLikes);

// Check if user has liked a post
router.get("/post/:postId/liked", authenticateToken, hasUserLiked);

// Get all posts liked by current user
router.get("/user/me", authenticateToken, getUserLikes);

module.exports = router;
