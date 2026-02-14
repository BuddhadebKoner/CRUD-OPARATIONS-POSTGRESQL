import express from "express";
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/userController.js";
import validate from "../middlewares/validate.js";
import { createUserSchema, updateUserSchema, paginationSchema, idParamSchema } from "../validators/userValidator.js";

const userRouter = express.Router();

userRouter.get("/", validate(paginationSchema, "query"), getAllUsers);
userRouter.post("/", validate(createUserSchema, "body"), createUser);
userRouter.get("/:id", validate(idParamSchema, "params"), getUserById);
userRouter.patch("/:id", validate(idParamSchema, "params"), validate(updateUserSchema, "body"), updateUser);
userRouter.delete("/:id", validate(idParamSchema, "params"), deleteUser);

export default userRouter;