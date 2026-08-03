import { useState, useEffect } from "react";
import { createItem, updateItem } from "../services/itemsApi";
import "../css/ItemFormModal.css";

const emptyForm = {
  name: "",
  category: "",
  rating: "",
  notes: "",
  image_url: "",
};

function ItemFormModal({ locationId, item, onClose, onSaved }) {
  const isEditing = !!item;
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(item ? { ...emptyForm, ...item } : emptyForm);
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      rating: form.rating === "" ? null : Number(form.rating),
    };

    try {
      if (isEditing) {
        await updateItem(locationId, item.id, payload);
      } else {
        await createItem(locationId, payload);
      }
      onSaved();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>{isEditing ? "Edit Item" : "Add Item"}</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {error && <p className="status status--error">{error}</p>}

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
            Category:
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
            />
          </label>
          <label>
            Rating (1-5):
            <input
              type="number"
              name="rating"
              min="1"
              max="5"
              value={form.rating}
              onChange={handleChange}
            />
          </label>
          <label>
            Notes:
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
            />
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

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : isEditing ? "Update Item" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ItemFormModal;