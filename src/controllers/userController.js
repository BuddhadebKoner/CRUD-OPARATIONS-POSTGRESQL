import { createUserService, deleteUserService, getAllUsersService, getUserByIdService, updateUserService } from "../models/userModel.js";

// standard response
const handleResponse = (res, statusCode, message, data = null) => {
   res.status(statusCode).json({
      success: statusCode >= 200 && statusCode < 300,
      message,
      data
   });
};

// Custom error class with status code
class AppError extends Error {
   constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.name = this.constructor.name;
   }
}

export const createUser = async (req, res, next) => {
   try {
      const { name, email } = req.body;

      if (!name || !email) {
         throw new AppError("Name and email are required", 400);
      }

      const newUser = await createUserService({ name, email });
      handleResponse(res, 201, "User created successfully", newUser);
   } catch (error) {
      next(error);
   }
};

export const getAllUsers = async (req, res, next) => {
   try {
      const { page = 1, limit = 10 } = req.query;
      const users = await getAllUsersService(parseInt(page), parseInt(limit));
      handleResponse(res, 200, "Users retrieved successfully", users);
   } catch (error) {
      next(error);
   }
};

export const getUserById = async (req, res, next) => {
   try {
      const { id } = req.params;
      const user = await getUserByIdService(id);

      if (!user) {
         throw new AppError("User not found", 404);
      }

      handleResponse(res, 200, "User retrieved successfully", user);
   } catch (error) {
      next(error);
   }
};

export const updateUser = async (req, res, next) => {
   try {
      const { id } = req.params;
      const { name, email } = req.body;

      const updatedUser = await updateUserService(id, { name, email });
      handleResponse(res, 200, "User updated successfully", updatedUser);
   } catch (error) {
      // Map specific errors to appropriate status codes
      if (error.message === "Email already exists") {
         error.statusCode = 409;
      } else if (error.message === "User not found") {
         error.statusCode = 404;
      } else if (error.message === "No fields to update") {
         error.statusCode = 400;
      }
      next(error);
   }
};

export const deleteUser = async (req, res, next) => {
   try {
      const { id } = req.params;
      const deletedUser = await deleteUserService(id);

      if (!deletedUser) {
         throw new AppError("User not found", 404);
      }

      handleResponse(res, 200, "User deleted successfully", deletedUser);
   } catch (error) {
      next(error);
   }
};