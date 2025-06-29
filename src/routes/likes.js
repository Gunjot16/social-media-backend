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

router.post("/post/:postId/like", authenticateToken, validatePostExists, likePost);

router.delete("/post/:postId/like", authenticateToken, validatePostExists, unlikePost);

router.get("/post/:postId", getPostLikes);

router.get("/post/:postId/liked", authenticateToken, hasUserLiked);

router.get("/user/me", authenticateToken, getUserLikes);

module.exports = router;
