
import { tags, locations, items, locationTags } from "../database/seeddata.js";

// CREATE ... IF NOT EXISTS 
export const createTablesQuery = `
  CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    notes TEXT,
    image_url VARCHAR(500),
    visited BOOLEAN DEFAULT FALSE,
    rating NUMERIC(2,1),
    place_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    rating INTEGER,
    notes TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS location_tags (
    location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (location_id, tag_id)
  );
`;

export const dropTablesQuery = `
  DROP TABLE IF EXISTS location_tags;
  DROP TABLE IF EXISTS user_locations;
  DROP TABLE IF EXISTS items;
  DROP TABLE IF EXISTS tags;
  DROP TABLE IF EXISTS locations;
`;

export const migrateTablesQuery = `
  ALTER TABLE locations ADD COLUMN IF NOT EXISTS rating NUMERIC(2,1);
  ALTER TABLE locations ADD COLUMN IF NOT EXISTS place_id VARCHAR(255) UNIQUE;
`;

export const countLocations = async (pool) => {
  const { rows } = await pool.query(`SELECT COUNT(*)::int AS count FROM locations;`);
  return rows[0].count;
};

export const seedTables = async (pool) => {
  const locationIds = [];
  for (const loc of locations) {
    const result = await pool.query(
      `INSERT INTO locations (name, address, notes, image_url, visited, rating)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id;`,
      [loc.name, loc.address, loc.notes, loc.image_url, loc.visited, loc.rating],
    );
    locationIds.push(result.rows[0].id);
  }

  const tagIdsByName = {};
  for (const tag of tags) {
    const result = await pool.query(
      `INSERT INTO tags (name) VALUES ($1) RETURNING id;`,
      [tag.name],
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
      ],
    );
  }

  for (const [locationIndex, tagName] of locationTags) {
    await pool.query(
      `INSERT INTO location_tags (location_id, tag_id) VALUES ($1, $2);`,
      [locationIds[locationIndex], tagIdsByName[tagName]],
    );
  }
};
