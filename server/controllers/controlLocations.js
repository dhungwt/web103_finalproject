import pool from "../config/database.js";

export const getAllLocations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM locations ORDER BY created_at DESC;`,
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to fetch locations." });
  }
};

export const getLocationById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM locations WHERE id = $1;`, [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Location not found." });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to fetch location." });
  }
};

export const createLocation = async (req, res) => {
  const { name, address, notes, image_url, visited } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO locations (name, address, notes, image_url, visited)
                VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [name, address, notes, image_url, visited],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to create location." });
  }
};

export const updateLocation = async (req, res) => {
  const { id } = req.params;
  const fields = ["name", "address", "notes", "image_url", "visited"];

  const updates = [];
  const values = [];
  let paramIndex = 1;

  for (const field of fields) {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = $${paramIndex}`);
      values.push(req.body[field]);
      paramIndex++;
    }
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: "No fields provided to update." });
  }

  values.push(id);

  try {
    const result = await pool.query(
      `UPDATE locations SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING *;`,
      values,
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Location not found." });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update location." });
  }
};

export const deleteLocation = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM locations WHERE id = $1 RETURNING *;`,
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Location not found." });
    }
    res
      .status(200)
      .json({ message: "Location deleted.", location: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to delete location." });
  }
};
