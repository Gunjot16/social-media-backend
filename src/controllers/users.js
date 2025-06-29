const logger = require("../utils/logger");
const followModel = require("../models/follow");
const userModel = require("../models/user");
const { query } = require("../utils/database");

exports.followUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followeeId = parseInt(req.params.id);

    if (followerId === followeeId) {
      return res.status(400).json({ error: "You can't follow yourself." });
    }

    const userToFollow = await userModel.getUserById(followeeId);
    if (!userToFollow) {
      return res.status(404).json({ error: "Target user does not exist." });
    }

    const isAlreadyFollowing = await followModel.checkIfFollowing(followerId, followeeId);
    if (isAlreadyFollowing) {
      return res.status(400).json({ error: "You are already following this user." });
    }

    await followModel.followUser(followerId, followeeId);
    res.status(200).json({ message: "Now following the user." });

  } catch (error) {
    logger.critical("Error while trying to follow user:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followeeId = parseInt(req.params.id);

    const userToUnfollow = await userModel.getUserById(followeeId);
    if (!userToUnfollow) {
      return res.status(404).json({ error: "User not found." });
    }

    const isFollowing = await followModel.checkIfFollowing(followerId, followeeId);
    if (!isFollowing) {
      return res.status(400).json({ error: "You are not following this user." });
    }

    await followModel.unfollowUser(followerId, followeeId);
    res.status(200).json({ message: "Unfollowed the user successfully." });

  } catch (error) {
    logger.critical("Error while unfollowing user:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

exports.getMyFollowing = async (req, res) => {
  try {
    const userId = req.user.id;
    const followingList = await followModel.getFollowing(userId);
    res.status(200).json({ following: followingList });
  } catch (error) {
    logger.critical("Error fetching following list:", error);
    res.status(500).json({ error: "Unable to fetch following list." });
  }
};

exports.getMyFollowers = async (req, res) => {
  try {
    const userId = req.user.id;
    const followerList = await followModel.getFollowers(userId);
    res.status(200).json({ followers: followerList });
  } catch (error) {
    logger.critical("Error fetching followers list:", error);
    res.status(500).json({ error: "Unable to fetch followers list." });
  }
};

exports.getMyFollowStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await followModel.getFollowCounts(userId);
    res.status(200).json({ stats });
  } catch (error) {
    logger.critical("Error retrieving follow stats:", error);
    res.status(500).json({ error: "Unable to retrieve follow statistics." });
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
      return res.status(404).json({ error: "User not found." });
    }

    const followers = await countFollowers(userId);
    const following = await countFollowing(userId);
    const posts = await getPostsByUserId(userId); 

    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        created_at: user.created_at,
        followers,
        following,
        posts,
      },
    });
  } catch (error) {
    logger.critical("Error loading user profile by ID:", error);
    res.status(500).json({ error: "Unable to retrieve user profile." });
  }
};

exports.searchUsers = async (req, res) => {
  const searchQuery = req.query.query;

  if (!searchQuery) {
    return res.status(400).json({ error: "Search query is required." });
  }

  try {
    const result = await query(
      "SELECT id, username, full_name FROM users WHERE username ILIKE $1 OR full_name ILIKE $1",
      [`%${searchQuery}%`]
    );

    res.status(200).json({ users: result.rows });
  } catch (error) {
    logger.critical("Error while searching users:", error);
    res.status(500).json({ error: "Something went wrong during user search." });
  }
};

exports.getUserProfileById = getUserProfileById;
