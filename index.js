import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pool from "./src/config/db.js";
import userRouter from "./src/routes/user.route.js";
import { createUserTable } from "./src/data/createUserTable.js";
import { errorHandler, notFoundHandler } from "./src/middlewares/errorHandle.js";

dotenv.config();

const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});
app.use(limiter);

app.use(express.json({ limit: "10kb" }));

app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

const startServer = async () => {
  try {
    await createUserTable();

    const result = await pool.query("SELECT current_database()");
    console.log(`Database connected: ${result.rows[0].current_database}`);
  } catch (err) {
    console.error("Failed to initialize database:", err.message);
    process.exit(1);
  }

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", uptime: process.uptime() });
  });

  app.get("/", async (req, res, next) => {
    try {
      const result = await pool.query("SELECT current_database()");
      res.json({
        message: "Welcome to the Express CRUD API",
        database: result.rows[0].current_database,
      });
    } catch (error) {
      next(error);
    }
  });

  app.use("/api/v1/users", userRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;

  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "not set"}`);
  });

  const gracefulShutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      console.log("HTTP server closed.");
      await pool.end();
      console.log("Database pool closed.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
};

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

startServer();