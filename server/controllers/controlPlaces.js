
const BASE = "https://places.googleapis.com/v1";

// Predictions as the user types
export const autocomplete = async (req, res) => {
  const KEY = process.env.GOOGLE_PLACES_API_KEY;
  const q = (req.query.q || "").trim();
  if (!q) return res.json([]);

  try {
    const r = await fetch(`${BASE}/places:autocomplete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": KEY,
        "X-Goog-FieldMask":
          "suggestions.placePrediction.placeId,suggestions.placePrediction.structuredFormat",
      },
      body: JSON.stringify({ input: q }),
    });
    if (!r.ok) {
      console.error("Places autocomplete error:", await r.text());
      return res.status(502).json({ error: "Places autocomplete failed." });
    }

    const suggestions = (await r.json()).suggestions || [];
    const results = suggestions
      .map((s) => s.placePrediction)
      .filter(Boolean)
      .map((p) => ({
        place_id: p.placeId,
        main: p.structuredFormat?.mainText?.text || "",
        secondary: p.structuredFormat?.secondaryText?.text || "",
      }));
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to search places." });
  }
};

// Full details + photo for the place the user picked.
export const details = async (req, res) => {
  const KEY = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = req.query.place_id;
  if (!placeId) return res.status(400).json({ error: "place_id is required." });

  try {
    const r = await fetch(`${BASE}/places/${placeId}`, {
      headers: {
        "X-Goog-Api-Key": KEY,
        "X-Goog-FieldMask": "id,displayName,formattedAddress,photos",
      },
    });
    if (!r.ok) {
      console.error("Place details error:", await r.text());
      return res.status(502).json({ error: "Place details failed." });
    }

    const p = await r.json();

    let image_url = null;
    const photoName = p.photos?.[0]?.name;
    if (photoName) {
      const pr = await fetch(
        `${BASE}/${photoName}/media?maxWidthPx=800&skipHttpRedirect=true`,
        { headers: { "X-Goog-Api-Key": KEY } },
      );
      if (pr.ok) image_url = (await pr.json()).photoUri || null;
    }

    res.json({
      place_id: p.id,
      name: p.displayName?.text || "",
      address: p.formattedAddress || "",
      image_url,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to fetch place details." });
  }
};
