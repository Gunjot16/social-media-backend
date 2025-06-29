const {
  likePost: likePostModel,
  unlikePost: unlikePostModel,
  getPostLikes,
  getUserLikes,
  hasUserLikedPost,
} = require("../models/like");

const logger = require("../utils/logger");

const likePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    await likePostModel(userId, postId);
    const likes = await getPostLikes(postId);

    return res.json({
      message: "Post liked successfully",
      likes,
    });
  } catch (error) {
    logger.error("Error while liking post:", error);
    return res.status(500).json({ error: "Failed to like the post" });
  }
};

const unlikePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    await unlikePostModel(userId, postId);
    const likes = await getPostLikes(postId);

    return res.json({
      message: "Post unliked successfully",
      likes,
    });
  } catch (error) {
    logger.error("Error while unliking post:", error);
    return res.status(500).json({ error: "Failed to unlike the post" });
  }
};

const getPostLikesController = async (req, res) => {
  try {
    const { postId } = req.params;
    const likes = await getPostLikes(postId);

    return res.json({
      postId,
      likes,
    });
  } catch (error) {
    logger.error("Error fetching post likes:", error);
    return res.status(500).json({ error: "Failed to fetch post likes" });
  }
};

const getUserLikesController = async (req, res) => {
  try {
    const userId = req.user.id;
    const likedPosts = await getUserLikes(userId);

    return res.json({
      userId,
      likedPosts,
    });
  } catch (error) {
    logger.error("Error fetching user liked posts:", error);
    return res.status(500).json({ error: "Failed to fetch liked posts" });
  }
};

const hasUserLiked = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    const liked = await hasUserLikedPost(userId, postId);

    return res.json({
      postId,
      liked,
    });
  } catch (error) {
    logger.error("Error checking like status:", error);
    return res.status(500).json({ error: "Failed to check like status" });
  }
};

module.exports = {
  likePost,
  unlikePost,
  getPostLikes: getPostLikesController,
  getUserLikes: getUserLikesController,
  hasUserLiked,
};
