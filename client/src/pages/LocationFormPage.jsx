import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  createLocation,
  updateLocation,
  getLocationById,
} from "../services/locationsApi";

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
  });
  const [error, setError] = useState(null); 

  useEffect(() => {
    if (!isEditing) return; // exit early if adding

    const fetchLocation = async () => {
      try {
        const locationData = await getLocationById(id);
        setForm(locationData);
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchLocation();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateLocation(id, form);
      } else {
        await createLocation(form);
      }
      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Something went wrong. Please try again."); // add this
    }
  };
  return (
    <>
    {error && <p className="status status--error">{error}</p>}
    <div className="location-form-page">
      <h2>{isEditing ? "Edit Location" : "Add Location"}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Notes:
          <textarea name="notes" value={form.notes} onChange={handleChange} />
        </label>
        <label>
          Image URL:
          <input
            type="text"
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
          />
        </label>
        <label>
          Visited:
          <input
            type="checkbox"
            name="visited"
            checked={form.visited}
            onChange={handleChange}
          />
        </label>
        <button type="submit">{isEditing ? "Update" : "Add"} Location</button>
      </form>
    </div>
    </>
  );
}

export default LocationFormPage;
