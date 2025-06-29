const {
	likePost: likePostModel,
	unlikePost: unlikePostModel,
	getPostLikes,
	getUserLikes,
	hasUserLikedPost,
} = require("../models/like");

const logger = require("../utils/logger");

/**
 * Like a post
 */
const likePost = async (req, res) => {
	try {
		const userId = req.user.id;
		const { postId } = req.params;

		await likePostModel(userId, postId);
		const likes = await getPostLikes(postId);

		res.json({ message: "Post liked", likes });
	} catch (err) {
		logger.error("Error liking post", err);
		res.status(500).json({ error: "Failed to like post" });
	}
};

/**
 * Unlike a post
 */
const unlikePost = async (req, res) => {
	try {
		const userId = req.user.id;
		const { postId } = req.params;

		await unlikePostModel(userId, postId);
		const likes = await getPostLikes(postId);

		res.json({ message: "Post unliked", likes });
	} catch (err) {
		logger.error("Error unliking post", err);
		res.status(500).json({ error: "Failed to unlike post" });
	}
};

/**
 * Get total likes for a post
 */
const getPostLikesController = async (req, res) => {
	try {
		const { postId } = req.params;
		const likes = await getPostLikes(postId);
		res.json({ postId, likes });
	} catch (err) {
		logger.error("Error getting post likes", err);
		res.status(500).json({ error: "Failed to get likes" });
	}
};

/**
 * Get posts liked by current user
 */
const getUserLikesController = async (req, res) => {
	try {
		const userId = req.user.id;
		const likedPosts = await getUserLikes(userId);
		res.json({ userId, likedPosts });
	} catch (err) {
		logger.error("Error getting user liked posts", err);
		res.status(500).json({ error: "Failed to get liked posts" });
	}
};

/**
 * Check if user has liked a post
 */
const hasUserLiked = async (req, res) => {
	try {
		const userId = req.user.id;
		const { postId } = req.params;
		const liked = await hasUserLikedPost(userId, postId);
		res.json({ postId, liked });
	} catch (err) {
		logger.error("Error checking like status", err);
		res.status(500).json({ error: "Failed to check like status" });
	}
};

module.exports = {
	likePost,
	unlikePost,
	getPostLikes: getPostLikesController,
	getUserLikes: getUserLikesController,
	hasUserLiked,
};
