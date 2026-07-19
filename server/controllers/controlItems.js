import pool from "../config/database.js";

export const getAllItems = async (req, res) => {
  const { locationId } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM items WHERE location_id = $1 ORDER BY created_at DESC;`,
      [locationId],
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to fetch items." });
  }
};

export const getItemById = async (req, res) => {
  const { itemId, locationId } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM items WHERE id = $1 AND location_id = $2;`,
      [itemId, locationId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item not found." });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to fetch item." });
  }
};

export const createItem = async (req, res) => {
  const { locationId } = req.params;
  const { name, category, rating, notes, image_url } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO items (name, location_id, category, rating, notes, image_url)
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
      [name, locationId, category, rating, notes, image_url],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to create item." });
  }
};

export const updateItem = async (req, res) => {
  const { itemId } = req.params;
  const fields = ["name", "category", "rating", "notes", "image_url"];

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

  values.push(itemId);

  try {
    const result = await pool.query(
      `UPDATE items SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING *;`,
      values,
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item not found." });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update item." });
  }
};

export const deleteItem = async (req, res) => {
  const { itemId, locationId } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM items WHERE id = $1 AND location_id = $2 RETURNING *;`,
      [itemId, locationId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item not found." });
    }
    res.status(200).json({ message: "Item deleted.", item: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to delete item." });
  }
};
