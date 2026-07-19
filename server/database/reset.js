import pool from "../config/database.js";
import { tags, locations, items, locationTags } from "../database/seeddata.js";

const createTables = async () => {
  await pool.query(`DROP TABLE IF EXISTS location_tags;`);
  await pool.query(`DROP TABLE IF EXISTS items;`);
  await pool.query(`DROP TABLE IF EXISTS tags;`);
  await pool.query(`DROP TABLE IF EXISTS locations;`);

  await pool.query(`
    CREATE TABLE locations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255),
      notes TEXT,
      image_url VARCHAR(500),
      visited BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE items (
      id SERIAL PRIMARY KEY,
      location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      rating INTEGER,
      notes TEXT,
      image_url VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE tags (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE location_tags (
      location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
      tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (location_id, tag_id)
    );
  `);

  console.log("Tables created.");
};

const seedTables = async () => {
  const locationIds = [];
  for (const loc of locations) {
    const result = await pool.query(
      `INSERT INTO locations (name, address, notes, image_url, visited)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id;`,
      [
        loc.name,
        loc.address,
        loc.notes,
        loc.image_url,
        loc.visited,
      ]
    );
    locationIds.push(result.rows[0].id);
  }

  const tagIdsByName = {};
  for (const tag of tags) {
    const result = await pool.query(
      `INSERT INTO tags (name) VALUES ($1) RETURNING id;`,
      [tag.name]
    );
    tagIdsByName[tag.name] = result.rows[0].id;
  }

  for (const item of items) {
    await pool.query(
      `INSERT INTO items (location_id, name, category, rating, notes, image_url)
       VALUES ($1, $2, $3, $4, $5, $6);`,
      [
        locationIds[item.locationIndex],
        item.name,
        item.category,
        item.rating,
        item.notes,
        item.image_url,
      ]
    );
  }

  for (const [locationIndex, tagName] of locationTags) {
    await pool.query(
      `INSERT INTO location_tags (location_id, tag_id) VALUES ($1, $2);`,
      [locationIds[locationIndex], tagIdsByName[tagName]]
    );
  }

  console.log("Sample bakery data seeded.");
};

const reset = async () => {
  try {
    await createTables();
    await seedTables();
  } catch (err) {
    console.error("Error resetting database:", err);
  } finally {
    await pool.end();
  }
};

reset();