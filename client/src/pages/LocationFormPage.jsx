import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  createLocation,
  updateLocation,
  getLocationById,
} from "../services/locationsApi";
import { searchPlaces, getPlaceDetails } from "../services/placesApi";
import {
  getTags,
  createTag,
  getTagsByLocation,
  addTagToLocation,
  removeTagFromLocation,
} from "../services/tagsApi";
import "../css/LocationFormPage.css";

function LocationFormPage() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
    notes: "",
    image_url: "",
    visited: false,
    rating: "",
    place_id: "",
  });
  const [error, setError] = useState(null);

  // Place autocomplete state (add mode only)
  const [placeQuery, setPlaceQuery] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [searching, setSearching] = useState(false);

  // Tag state
  const [allTags, setAllTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [originalTagIds, setOriginalTagIds] = useState([]);
  const [newTagName, setNewTagName] = useState("");

  // Load the full tag list once (for the selectable chips).
  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await getTags();
        setAllTags(tags);
      } catch (err) {
        console.error(err);
      }
    };
    loadTags();
  }, []);

  // In edit mode, load the location and its current tags.
  useEffect(() => {
    if (!isEditing) return;

    const fetchLocation = async () => {
      try {
        const locationData = await getLocationById(id);
        setForm(locationData);

        const locTags = await getTagsByLocation(id);
        const ids = locTags.map((t) => t.id);
        setSelectedTagIds(ids);
        setOriginalTagIds(ids);
      } catch (fetchError) {
        console.error("Error fetching location:", fetchError);
      }
    };

    fetchLocation();
  }, [id, isEditing]);

  // Debounced place search waits ~0.8s after typing stops, then fetches predictions.
  useEffect(() => {
    const q = placeQuery.trim();
    if (q.length < 3) {
      setPredictions([]);
      return;
    }

    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchPlaces(q);
        setPredictions(results);
      } catch (err) {
        console.error(err);
        setPredictions([]);
      } finally {
        setSearching(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [placeQuery]);

  const handleSelectPlace = async (prediction) => {
    setPredictions([]);
    setPlaceQuery(prediction.main);
    try {
      const details = await getPlaceDetails(prediction.place_id);
      setForm((prev) => ({
        ...prev,
        name: details.name || prev.name,
        address: details.address || prev.address,
        image_url: details.image_url || prev.image_url,
        place_id: details.place_id,
      }));
    } catch (err) {
      console.error(err);
      setError("Could not load that place — you can still fill it in manually.");
    }
  };

  const toggleTag = (tagId) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId],
    );
  };

  // Add a brand-new tag the user typed (creating it if it doesn't exist yet).
  const handleAddNewTag = async () => {
    const name = newTagName.trim();
    if (!name) return;

    const existing = allTags.find(
      (t) => t.name.toLowerCase() === name.toLowerCase(),
    );
    if (existing) {
      setSelectedTagIds((prev) =>
        prev.includes(existing.id) ? prev : [...prev, existing.id],
      );
      setNewTagName("");
      return;
    }

    try {
      const created = await createTag(name);
      setAllTags((prev) => [...prev, created]);
      setSelectedTagIds((prev) => [...prev, created.id]);
      setNewTagName("");
    } catch (err) {
      console.error(err);
      // Likely a race where the tag now exists — refresh and select it.
      try {
        const tags = await getTags();
        setAllTags(tags);
        const match = tags.find((t) => t.name.toLowerCase() === name.toLowerCase());
        if (match) {
          setSelectedTagIds((prev) =>
            prev.includes(match.id) ? prev : [...prev, match.id],
          );
        }
      } catch (e) {
        console.error(e);
      }
      setNewTagName("");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      rating: form.rating === "" || form.rating == null ? null : Number(form.rating),
      place_id: form.place_id || null, // "" would collide on the UNIQUE column
    };

    try {
      if (isEditing) {
        await updateLocation(id, payload);

        const toAdd = selectedTagIds.filter((t) => !originalTagIds.includes(t));
        const toRemove = originalTagIds.filter((t) => !selectedTagIds.includes(t));
        await Promise.all([
          ...toAdd.map((t) => addTagToLocation(id, t)),
          ...toRemove.map((t) => removeTagFromLocation(id, t)),
        ]);
      } else {
        const created = await createLocation(payload);
        await Promise.all(
          selectedTagIds.map((t) => addTagToLocation(created.id, t)),
        );
      }
      navigate("/");
    } catch (submitError) {
      console.error("Error submitting form:", submitError);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {error && <p className="status status--error">{error}</p>}
      <div className="location-form-page">
        <h2>{isEditing ? "Edit Location" : "Add Location"}</h2>

        {!isEditing && (
          <div className="place-search">
            <label htmlFor="place-search">Search for a place</label>
            <input
              id="place-search"
              type="text"
              placeholder="Start typing a bakery or restaurant name…"
              value={placeQuery}
              onChange={(e) => setPlaceQuery(e.target.value)}
              autoComplete="off"
            />
            {searching && <p className="place-search__status">Searching…</p>}
            {predictions.length > 0 && (
              <ul className="place-search__list">
                {predictions.map((p) => (
                  <li key={p.place_id}>
                    <button type="button" onClick={() => handleSelectPlace(p)}>
                      <span className="place-search__main">{p.main}</span>
                      <span className="place-search__secondary">{p.secondary}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <p className="place-search__hint">
              Pick a result to auto-fill the fields, or just type them in yourself.
            </p>
          </div>
        )}

        <form className="location-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter location name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              name="address"
              placeholder="Enter address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Enter notes"
              value={form.notes}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="image_url">Image URL</label>
            <input
              id="image_url"
              type="text"
              name="image_url"
              placeholder="Enter image URL"
              value={form.image_url}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="rating">Rating</label>
            <input
              id="rating"
              type="number"
              name="rating"
              min="0"
              max="5"
              step="0.1"
              placeholder="0-5"
              value={form.rating ?? ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>Tags</label>
            {allTags.length > 0 && (
              <div className="tag-select">
                {allTags.map((tag) => (
                  <button
                    type="button"
                    key={tag.id}
                    className={
                      selectedTagIds.includes(tag.id)
                        ? "tag-chip tag-chip--active"
                        : "tag-chip"
                    }
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
            <div className="tag-add">
              <input
                type="text"
                placeholder="Add a new tag"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddNewTag();
                  }
                }}
              />
              <button type="button" onClick={handleAddNewTag}>
                Add
              </button>
            </div>
          </div>

          <div className="form-field form-field--checkbox">
            <label htmlFor="visited">
              <input
                id="visited"
                type="checkbox"
                name="visited"
                checked={form.visited}
                onChange={handleChange}
              />
              Visited
            </label>
          </div>

          <div className="form-actions">
            <button type="submit">{isEditing ? "Update" : "Add"} Location</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default LocationFormPage;
