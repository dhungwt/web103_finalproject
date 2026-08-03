import pool from "./database.js";
import { dropTablesQuery, createTablesQuery, seedTables } from "./schema.js";

const reset = async () => {
  try {
    await pool.query(dropTablesQuery);
    await pool.query(createTablesQuery);
    await seedTables(pool);
    console.log("Hard reset complete, tables dropped, recreated, and reseeded.");
  } catch (err) {
    console.error("Error during hard reset:", err);
  } finally {
    await pool.end();
  }
};

reset();
