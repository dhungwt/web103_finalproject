import pool from "../config/database.js";

// users table: one row per GitHub account that has ever logged in
const createUsersTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY,
    github_id integer UNIQUE NOT NULL,
    username varchar(200) NOT NULL,
    avatar_url varchar(500),
    access_token varchar(500) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
  );
`;

// user_locations: join table so a location can be saved by a user (a user's bucket list)
const createUserLocationsTableQuery = `
  CREATE TABLE IF NOT EXISTS user_locations (
    user_id integer REFERENCES users(id) ON DELETE CASCADE,
    location_id integer REFERENCES locations(id) ON DELETE CASCADE,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, location_id)
  );
`;

const initTables = async () => {
  try {
    await pool.query(createUsersTableQuery);
    await pool.query(createUserLocationsTableQuery);
    console.log("✅ users and user_locations tables ready!");
  } catch (error) {
    console.error(error);
  }
};

initTables();

// find a user by github id, or create them if this is their first login
export const findOrCreateUser = async ({
  githubId,
  username,
  avatarUrl,
  accessToken,
}) => {
  const existing = await pool.query(
    "SELECT * FROM users WHERE github_id = $1",
    [githubId],
  );

  if (existing.rows[0]) {
    const updated = await pool.query(
      `UPDATE users SET username = $1, avatar_url = $2, access_token = $3
       WHERE github_id = $4 RETURNING *;`,
      [username, avatarUrl, accessToken, githubId],
    );
    return updated.rows[0];
  }

  const inserted = await pool.query(
    `INSERT INTO users (github_id, username, avatar_url, access_token)
     VALUES ($1, $2, $3, $4) RETURNING *;`,
    [githubId, username, avatarUrl, accessToken],
  );
  return inserted.rows[0];
};

// used by passport.deserializeUser to rehydrate req.user from the session's user id
export const getUserById = async (id) => {
  const result = await pool.query(
    "SELECT id, github_id, username, avatar_url, created_at FROM users WHERE id = $1",
    [id],
  );
  return result.rows[0];
};

// GET /api/locations/:locationId/users - who has saved this location
export const getUsersByLocation = async (req, res) => {
  const { locationId } = req.params;
  try {
    const result = await pool.query(
      `SELECT users.id, users.username, users.avatar_url
       FROM users
       JOIN user_locations ON users.id = user_locations.user_id
       WHERE user_locations.location_id = $1;`,
      [locationId],
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to fetch users for location." });
  }
};

// GET /api/users/:userId/locations - this user's saved bucket list
export const getLocationsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT locations.*
       FROM locations
       JOIN user_locations ON locations.id = user_locations.location_id
       WHERE user_locations.user_id = $1
       ORDER BY locations.created_at DESC;`,
      [userId],
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to fetch locations for user." });
  }
};

// POST /api/users/:userId/locations { location_id } - save a location to this user's list
export const addLocationForUser = async (req, res) => {
  const { userId } = req.params;
  const { location_id } = req.body;

  if (!location_id) {
    return res.status(400).json({ error: "location_id is required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO user_locations (user_id, location_id)
       VALUES ($1, $2) RETURNING *;`,
      [userId, location_id],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "User already saved this location." });
    }
    if (err.code === "23503") {
      return res.status(404).json({ error: "User or location not found." });
    }
    console.error(err);
    res.status(500).json({ error: "Unable to save location for user." });
  }
};

// DELETE /api/users/:userId/locations/:locationId - remove a location from this user's list
export const removeLocationForUser = async (req, res) => {
  const { userId, locationId } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM user_locations WHERE user_id = $1 AND location_id = $2 RETURNING *;`,
      [userId, locationId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User has not saved this location." });
    }
    res.status(200).json({ message: "Location removed from user's list." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to remove location for user." });
  }
};
