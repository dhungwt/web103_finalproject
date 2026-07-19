import pool from "../config/database.js";


export const getAllTags = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM tags;`);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to fetch tags." });
  }
};

export const getTagsByLocation = async (req, res) => {
  const { locationId } = req.params;
  try {
    const result = await pool.query(
      `SELECT tags.* FROM tags
JOIN location_tags ON tags.id = location_tags.tag_id
WHERE location_tags.location_id = $1;`,
      [locationId],
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to fetch tag." });
  }
};

export const addTagToLocation = async (req, res) => {
  const { locationId } = req.params;
  const { tag_id } = req.body;

  if (!tag_id) {
    return res.status(400).json({ error: "tag_id is required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO location_tags (location_id, tag_id)
       VALUES ($1, $2) RETURNING *;`,
      [locationId, tag_id],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Location already has this tag." });
    }
    if (err.code === "23503") {
      return res.status(404).json({ error: "Location or tag not found." });
    }
    console.error(err);
    res.status(500).json({ error: "Unable to add tag to location." });
  }
};