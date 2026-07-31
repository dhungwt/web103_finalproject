import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  createLocation,
  updateLocation,
  getLocationById,
} from "../services/locationsApi";
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
      <form className="location-form" onSubmit={handleSubmit}>

        {/*Name element*/}
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

        {/*Address element*/}
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

        {/*Notes element*/}
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

        {/*Image URL element*/}
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

        {/*Visited element*/}
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

        {/*Submit button element*/}
        <div className="form-actions">
          <button type="submit">{isEditing ? "Update" : "Add"} Location</button>
        </div>

      </form>
    </div>
    </>
  );
}

export default LocationFormPage;
