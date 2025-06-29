const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const commentController = require("../controllers/comments");

const router = express.Router();

router.post("/posts/:postId/comments", authenticateToken, commentController.createComment);

router.put("/comments/:commentId", authenticateToken, commentController.updateComment);

router.delete("/comments/:commentId", authenticateToken, commentController.deleteComment);

router.get("/posts/:postId/comments", commentController.getPostComments);

module.exports = router;
