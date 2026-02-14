import express from "express";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/user.js";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.post("/", createUser);
userRouter.get("/:id", getUserById);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);

export default userRouter;