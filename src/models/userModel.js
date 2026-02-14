import pool from "../config/db.js";
import AppError from "../utils/AppError.js";

export const getAllUsersService = async (page, limit) => {
   const offset = (page - 1) * limit;

   const [dataResult, countResult] = await Promise.all([
      pool.query("SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2", [limit, offset]),
      pool.query("SELECT COUNT(*) FROM users"),
   ]);

   const total = parseInt(countResult.rows[0].count, 10);

   return {
      users: dataResult.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
   };
};

export const createUserService = async (userData) => {
   const { name, email } = userData;
   const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
   );
   return result.rows[0];
};

export const getUserByIdService = async (id) => {
   const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
   return result.rows[0];
};

export const updateUserService = async (id, userData) => {
   const { name, email } = userData;

   const updates = [];
   const values = [];
   let paramCount = 1;

   if (name !== undefined) {
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
   }

   if (email !== undefined) {
      updates.push(`email = $${paramCount}`);
      values.push(email);
      paramCount++;
   }

   if (updates.length === 0) {
      throw new AppError("No fields to update", 400);
   }

   updates.push(`updated_at = NOW()`);

   values.push(id);
   const query = `UPDATE users SET ${updates.join(", ")} WHERE id = $${paramCount} RETURNING *`;

   const result = await pool.query(query, values);

   if (result.rows.length === 0) {
      throw new AppError("User not found", 404);
   }

   return result.rows[0];
};

export const deleteUserService = async (id) => {
   const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
   return result.rows[0];
};