const express = require("express");
const { validateRequest, createPostSchema } = require("../utils/validation");
const {
  create,
  getById,
  getUserPosts,
  getMyPosts,
  remove,
  getFeed,
} = require("../controllers/posts");
const { authenticateToken, optionalAuth } = require("../middleware/auth");

const router = express.Router();



router.post("/", authenticateToken, validateRequest(createPostSchema), create);

router.get("/my", authenticateToken, getMyPosts);

router.get("/feed", authenticateToken, getFeed); // ✅ New feed route

router.get("/:post_id", optionalAuth, getById);

router.get("/user/:user_id", optionalAuth, getUserPosts);

router.delete("/:post_id", authenticateToken, remove);


module.exports = router;
