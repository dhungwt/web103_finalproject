
// Creates tables only if missing and seeds ONLY when the DB is empty, so it
import pool from "./database.js";
import {
  createTablesQuery,
  migrateTablesQuery,
  countLocations,
  seedTables,
} from "./schema.js";

const init = async () => {
  try {
    await pool.query(createTablesQuery); // create-if-not-exists — never drops
    await pool.query(migrateTablesQuery); // add any missing columns — never drops

    const count = await countLocations(pool);
    if (count === 0) {
      await seedTables(pool);
      console.log("DB was empty — seeded starter sample data.");
    } else {
      console.log(`Tables ready. ${count} locations already present — left untouched.`);
    }
  } catch (err) {
    console.error("Error during init:", err);
  } finally {
    await pool.end();
  }
};

init();
