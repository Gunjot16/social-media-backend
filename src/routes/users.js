const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const userController = require("../controllers/users");

router.post("/follow/:id", authenticateToken, userController.followUser);
router.get("/:id/profile", userController.getUserProfileById);
router.delete("/unfollow/:id", authenticateToken, userController.unfollowUser);
router.get("/follow/following", authenticateToken, userController.getMyFollowing);
router.get("/follow/followers", authenticateToken, userController.getMyFollowers);
router.get("/search", authenticateToken, userController.searchUsers);

router.get("/follow/stats", authenticateToken, userController.getMyFollowStats);

module.exports = router;
