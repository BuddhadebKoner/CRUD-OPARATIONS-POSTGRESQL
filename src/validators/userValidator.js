import Joi from "joi";

export const createUserSchema = Joi.object({
   name: Joi.string().trim().min(2).max(255).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name must not exceed 255 characters",
      "any.required": "Name is required",
   }),
   email: Joi.string().trim().email().max(255).required().messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
      "string.max": "Email must not exceed 255 characters",
      "any.required": "Email is required",
   }),
});

export const updateUserSchema = Joi.object({
   name: Joi.string().trim().min(2).max(255).messages({
      "string.empty": "Name cannot be empty",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name must not exceed 255 characters",
   }),
   email: Joi.string().trim().email().max(255).messages({
      "string.empty": "Email cannot be empty",
      "string.email": "Please provide a valid email address",
      "string.max": "Email must not exceed 255 characters",
   }),
}).min(1).messages({
   "object.min": "At least one field (name or email) must be provided",
});

export const paginationSchema = Joi.object({
   page: Joi.number().integer().min(1).default(1).messages({
      "number.base": "Page must be a number",
      "number.integer": "Page must be an integer",
      "number.min": "Page must be at least 1",
   }),
   limit: Joi.number().integer().min(1).max(100).default(10).messages({
      "number.base": "Limit must be a number",
      "number.integer": "Limit must be an integer",
      "number.min": "Limit must be at least 1",
      "number.max": "Limit must not exceed 100",
   }),
});

export const idParamSchema = Joi.object({
   id: Joi.number().integer().positive().required().messages({
      "number.base": "ID must be a number",
      "number.integer": "ID must be an integer",
      "number.positive": "ID must be a positive number",
      "any.required": "ID is required",
   }),
});
