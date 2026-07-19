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
