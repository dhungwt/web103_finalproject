// ONE-TIME real-data populate — run with:  node --require dotenv/config config/populate.js
//
// Fetches real places (name, address, PHOTO) from Google Places (New) and upserts
// them into the shared DB, so teammates get real locations WITHOUT the API key.
// Idempotent: re-running skips places already stored (dedupe on place_id).
//
// Requires GOOGLE_PLACES_API_KEY in server/.env (Google Cloud project with billing
// enabled + "Places API (New)" turned on). Run this yourself once against the shared DB.
//
// VERIFIED 2026-08-01 against the live API: searchText returns id/displayName/
// formattedAddress/photos; the photo /media?skipHttpRedirect=true call returns
// { name, photoUri } where photoUri is a googleusercontent.com image URL.

import pool from "./database.js";

const KEY = process.env.GOOGLE_PLACES_API_KEY;
const BASE = "https://places.googleapis.com/v1";

// Fixed demo-seed list — populates just these five known places so the app isn't
// empty for a demo. (Real, ongoing adds happen through the live autocomplete flow.)
const PLACES_TO_ADD = [
  "Levain Bakery New York",
  "Breads Bakery New York",
  "Mah-Ze-Dahr Bakery New York",
  "Dominique Ansel Bakery New York",
  "Magnolia Bakery New York",
];

// Turn a Google photo resource name into a usable image URL.
const fetchPhotoUrl = async (photoName) => {
  const url = `${BASE}/${photoName}/media?maxWidthPx=800&skipHttpRedirect=true`;
  const res = await fetch(url, { headers: { "X-Goog-Api-Key": KEY } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.photoUri || null; // { name, photoUri }
};

const searchPlace = async (textQuery) => {
  const res = await fetch(`${BASE}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": KEY,
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.photos",
    },
    body: JSON.stringify({ textQuery, maxResultCount: 1 }),
  });
  if (!res.ok) {
    throw new Error(`Google ${res.status}: ${await res.text()}`);
  }

  const place = (await res.json()).places?.[0];
  if (!place) return null;

  const photoName = place.photos?.[0]?.name;
  const image_url = photoName ? await fetchPhotoUrl(photoName) : null;

  return {
    place_id: place.id,
    name: place.displayName?.text,
    address: place.formattedAddress || null,
    image_url,
  };
};

// Insert, skipping any place already stored
const upsertLocation = async (place) => {
  const result = await pool.query(
    `INSERT INTO locations (name, address, image_url, place_id)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (place_id) DO NOTHING
     RETURNING id;`,
    [place.name, place.address, place.image_url, place.place_id],
  );
  return result.rows.length > 0; // true = inserted, false = already existed
};

const populate = async () => {
  if (!KEY) {
    console.error("GOOGLE_PLACES_API_KEY missing from server/.env — add it before running.");
    await pool.end();
    return;
  }

  let added = 0;
  let skipped = 0;

  for (const query of PLACES_TO_ADD) {
    try {
      const place = await searchPlace(query);
      if (!place || !place.place_id) {
        console.warn(`⚠️  No usable result for "${query}"`);
        continue;
      }
      const inserted = await upsertLocation(place);
      inserted ? added++ : skipped++;
      console.log(
        `${inserted ? "➕ added" : "↩︎ skipped (exists)"}: ${place.name}` +
          `${place.image_url ? " 📷" : " (no photo)"} — ${place.address}`,
      );
    } catch (err) {
      console.error(`Error on "${query}":`, err.message);
    }
  }

  console.log(`\nDone. ${added} added, ${skipped} already present.`);
  await pool.end();
};

populate();
