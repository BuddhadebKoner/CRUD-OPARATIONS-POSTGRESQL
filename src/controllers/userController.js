import { createUserService, deleteUserService, getAllUsersService, getUserByIdService, updateUserService } from "../models/userModel.js";
import AppError from "../utils/AppError.js";
import handleResponse from "../utils/handleResponse.js";

export const createUser = async (req, res, next) => {
   try {
      const { name, email } = req.validated.body;

      const newUser = await createUserService({ name, email });
      handleResponse(res, 201, "User created successfully", newUser);
   } catch (error) {
      next(error);
   }
};

export const getAllUsers = async (req, res, next) => {
   try {
      const { page, limit } = req.validated.query;

      const result = await getAllUsersService(page, limit);
      handleResponse(res, 200, "Users retrieved successfully", result);
   } catch (error) {
      next(error);
   }
};

export const getUserById = async (req, res, next) => {
   try {
      const { id } = req.validated.params;
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
      const { id } = req.validated.params;
      const { name, email } = req.validated.body;

      const updatedUser = await updateUserService(id, { name, email });
      handleResponse(res, 200, "User updated successfully", updatedUser);
   } catch (error) {
      next(error);
   }
};

export const deleteUser = async (req, res, next) => {
   try {
      const { id } = req.validated.params;
      const deletedUser = await deleteUserService(id);

      if (!deletedUser) {
         throw new AppError("User not found", 404);
      }

      handleResponse(res, 200, "User deleted successfully", deletedUser);
   } catch (error) {
      next(error);
   }
};