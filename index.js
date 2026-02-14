import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./src/config/db.js";
import userRouter from "./src/routes/user.route.js";
import { createUserTable } from "./src/data/createUserTable.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// create user table if not exists
createUserTable();

// database connection
pool.connect()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection error:", err));

// routes /api/v1
app.get("/", async (req, res) => {
  const result = await pool.query("SELECT current_database()");
  // send json 
  res.json({ message: "Welcome to the Express CRUD API", database: result.rows[0].current_database });
});

// userRouter
app.use("/api/v1/users", userRouter);

// Import error handlers
import { errorHandler, notFoundHandler } from "./src/middlewares/errorHandle.js";

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Global error handler - must be last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;


// listen
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});