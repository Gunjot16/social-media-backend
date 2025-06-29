const Joi = require("joi");
const { getPostById } = require("../models/post");

/**
 * Joi validation schemas
 */
const userRegistrationSchema = Joi.object({
	username: Joi.string().alphanum().min(3).max(30).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
	full_name: Joi.string().min(1).max(100).required(),
});

const userLoginSchema = Joi.object({
	username: Joi.string().required(),
	password: Joi.string().required(),
});

const createPostSchema = Joi.object({
	content: Joi.string().min(1).max(1000).required(),
	media_url: Joi.string().uri().optional(),
	comments_enabled: Joi.boolean().default(true),
	scheduled_at: Joi.date().optional(),

});

const updatePostSchema = Joi.object({
	content: Joi.string().max(1000),
	media_url: Joi.string().uri(),
	comments_enabled: Joi.boolean(),
}).min(1); // ✅ At least one field required

/**
 * Middleware: Validate request body using Joi schema
 */
const validateRequest = (schema) => {
	return (req, res, next) => {
		const { error, value } = schema.validate(req.body);

		if (error) {
			return res.status(400).json({
				error: "Validation failed",
				details: error.details.map((detail) => detail.message),
			});
		}

		req.validatedData = value;
		next();
	};
};

/**
 * Middleware: Check if a post exists
 */
const validatePostExists = async (req, res, next) => {
	const { postId } = req.params;
	const post = await getPostById(postId);
	if (!post) {
		return res.status(404).json({ error: "Post not found" });
	}
	next();
};

/**
 * Export all validators and middlewares
 */
module.exports = {
	userRegistrationSchema,
	userLoginSchema,
	createPostSchema,
	updatePostSchema,
	validateRequest,
	validatePostExists,
};
