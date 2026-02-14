## Database Connection Test

```sql
SELECT current_database();
```
Returns the name of the currently connected database.

---

## Create Table

```sql
CREATE TABLE IF NOT EXISTS users (
   id SERIAL PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   email VARCHAR(255) NOT NULL UNIQUE,
   created_at TIMESTAMP DEFAULT NOW(),
   updated_at TIMESTAMP DEFAULT NOW()
);
```
Creates the users table if it doesn't exist. `SERIAL` auto-increments the ID (1, 2, 3...). `UNIQUE` on email prevents duplicates. `IF NOT EXISTS` prevents errors if table already exists.

---

## Add Column to Existing Table

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
```
Adds `updated_at` column to existing table without failing if column already exists.

---

## Get All Users (Paginated)

```sql
SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2;
```
Retrieves users sorted by newest first. `LIMIT` = how many rows to return. `OFFSET` = how many rows to skip. For page 2 with limit 10: OFFSET = (2-1) * 10 = 10 (skip first 10 rows).

---

## Count Total Users

```sql
SELECT COUNT(*) FROM users;
```
Returns total number of rows in users table. Used for pagination to calculate total pages.

---

## Create User

```sql
INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *;
```
Inserts a new user. `RETURNING *` returns the newly created row including auto-generated `id` and timestamps. Throws error code `23505` if email already exists (UNIQUE constraint violation).

---

## Get User by ID

```sql
SELECT * FROM users WHERE id = $1;
```
Retrieves a single user by their ID. Returns empty result if user doesn't exist.

---

## Update User (Dynamic)

```sql
UPDATE users SET name = $1, email = $2, updated_at = NOW() WHERE id = $3 RETURNING *;
```
Updates user fields. `NOW()` sets current timestamp. `RETURNING *` returns the updated row. Can be partial (only name, only email, or both). Returns empty result if user not found.

---

## Delete User

```sql
DELETE FROM users WHERE id = $1 RETURNING *;
```
Deletes a user by ID. `RETURNING *` returns the deleted row (useful to confirm what was deleted). Returns empty result if user doesn't exist.

---

## PostgreSQL Concepts

**Parameterized Queries (`$1`, `$2`):** Prevents SQL injection. Values are escaped automatically by the database driver.

**SERIAL:** Auto-incrementing integer. Starts at 1, increments by 1 for each new row.

**UNIQUE Constraint:** Database enforces uniqueness. Throws error code `23505` if violated. Prevents race conditions.

**RETURNING Clause:** PostgreSQL-specific feature. Returns the affected row(s) after INSERT/UPDATE/DELETE.

**LIMIT & OFFSET:** Used for pagination. LIMIT = page size, OFFSET = (page - 1) * page size.

**COUNT(*):** Counts all rows. Can be slow on very large tables (millions of rows).

**NOW():** Returns current timestamp in server's timezone.

**ORDER BY ... DESC:** Sorts results by column in descending order (newest first).
