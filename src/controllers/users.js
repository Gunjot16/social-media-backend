const logger = require("../utils/logger");
const followModel = require("../models/follow");
const userModel = require("../models/user");
const { query } = require("../utils/database");


exports.followUser = async (req, res) => {
	try {
		const followerId = req.user.id;
		const followeeId = parseInt(req.params.id);

		if (followerId === followeeId) {
			return res.status(400).json({ error: "You cannot follow yourself." });
		}

		// Check if user exists
		const userExists = await userModel.getUserById(followeeId);
		if (!userExists) {
			return res.status(404).json({ error: "User not found." });
		}

		// Check if already following
		const alreadyFollowing = await followModel.checkIfFollowing(followerId, followeeId);
		if (alreadyFollowing) {
			return res.status(400).json({ error: "Already following this user." });
		}

		await followModel.followUser(followerId, followeeId);
		res.status(200).json({ message: "Successfully followed the user." });

	} catch (err) {
		logger.error("Error in followUser:", err);
		res.status(500).json({ error: "Failed to follow user." });
	}
};


exports.unfollowUser = async (req, res) => {
	try {
		const followerId = req.user.id;
		const followeeId = parseInt(req.params.id);

		const userExists = await userModel.getUserById(followeeId);
		if (!userExists) {
			return res.status(404).json({ error: "User not found." });
		}

		const alreadyFollowing = await followModel.checkIfFollowing(followerId, followeeId);
		if (!alreadyFollowing) {
			return res.status(400).json({ error: "You are not following this user." });
		}

		await followModel.unfollowUser(followerId, followeeId);
		res.status(200).json({ message: "Successfully unfollowed the user." });

	} catch (err) {
		logger.error("Error in unfollowUser:", err);
		res.status(500).json({ error: "Failed to unfollow user." });
	}
};

exports.getMyFollowing = async (req, res) => {
	try {
		const userId = req.user.id;
		const following = await followModel.getFollowing(userId);
		res.status(200).json({ following });
	} catch (err) {
		logger.error("Error in getMyFollowing:", err);
		res.status(500).json({ error: "Failed to get following list." });
	}
};

exports.getMyFollowers = async (req, res) => {
	try {
		const userId = req.user.id;
		const followers = await followModel.getFollowers(userId);
		res.status(200).json({ followers });
	} catch (err) {
		logger.error("Error in getMyFollowers:", err);
		res.status(500).json({ error: "Failed to get followers list." });
	}
};

exports.getMyFollowStats = async (req, res) => {
	try {
		const userId = req.user.id;
		const stats = await followModel.getFollowCounts(userId);
		res.status(200).json({ stats });
	} catch (err) {
		logger.error("Error in getMyFollowStats:", err);
		res.status(500).json({ error: "Failed to get follow stats." });
	}
};

const {
  createUser,
  getUserByUsername,
  verifyPassword,
  getUserById, 
} = require("../models/user");

const {
  countFollowers,
  countFollowing,
} = require("../models/follow"); 

const { getPostsByUserId } = require("../models/post"); 

 
const getUserProfileById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const followersCount = await countFollowers(userId);
    const followingCount = await countFollowing(userId);
    const posts = await getPostsByUserId(userId); // Optional

    res.json({
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        created_at: user.created_at,
        followers: followersCount,
        following: followingCount,
        posts,
      },
    });
  } catch (error) {
    logger.critical("Get user profile by ID error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.searchUsers = async (req, res) => {
  const searchQuery = req.query.query;

  if (!searchQuery) {
    return res.status(400).json({ error: "Query parameter is required." });
  }

  try {
    const result = await query(
      "SELECT id, username, full_name FROM users WHERE username ILIKE $1 OR full_name ILIKE $1",
      [`%${searchQuery}%`]
    );

    res.status(200).json({ users: result.rows });
  } catch (err) {
    console.error("Error searching users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getUserProfileById = getUserProfileById;
