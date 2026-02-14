import pool from "../config/db.js";

// pagination , page,limit, offset = (page - 1) * limit
export const getAllUsersService = async (page, limit) => {
   const offset = (page - 1) * limit;
   const result = await pool.query("SELECT * FROM users LIMIT $1 OFFSET $2", [limit, offset]);
   return result.rows;
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

   // Build dynamic update query based on provided fields
   const updates = [];
   const values = [];
   let paramCount = 1;

   if (name !== undefined) {
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
   }

   if (email !== undefined) {
      // Check if email already exists for a different user
      const emailCheck = await pool.query(
         "SELECT id FROM users WHERE email = $1 AND id != $2",
         [email, id]
      );

      if (emailCheck.rows.length > 0) {
         throw new Error("Email already exists");
      }

      updates.push(`email = $${paramCount}`);
      values.push(email);
      paramCount++;
   }

   if (updates.length === 0) {
      throw new Error("No fields to update");
   }

   values.push(id);
   const query = `UPDATE users SET ${updates.join(", ")} WHERE id = $${paramCount} RETURNING *`;

   const result = await pool.query(query, values);

   if (result.rows.length === 0) {
      throw new Error("User not found");
   }

   return result.rows[0];
};
export const deleteUserService = async (id) => {
   const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);

   return result.rows[0];
};