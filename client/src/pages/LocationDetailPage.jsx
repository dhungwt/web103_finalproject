import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getLocationById, deleteLocation } from "../services/locationsApi";
import {
  getItemsByLocation,
  createItem,
  deleteItem,
  updateItem,
} from "../services/itemsApi";
import ItemFormModal from "../components/ItemFormModal";
import { getTagsByLocation } from "../services/tagsApi";
import ItemCard from "../components/ItemCard";
import "../css/LocationDetailPage.css";

const emptyItemForm = {
  name: "",
  category: "",
  rating: "",
  notes: "",
  image_url: "",
};

function LocationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const [locationTags, setLocationTags] = useState([]);

  const [showItemForm, setShowItemForm] = useState(false);
  const [itemForm, setItemForm] = useState(emptyItemForm);
  const [itemError, setItemError] = useState(null);

  const handleDeleteLocation = async () => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      try {
        await deleteLocation(id);
        navigate("/");
      } catch (err) {
        console.error(err);
        setError("Unable to delete location.");
      }
    }
  };

  const handleDeleteItem = async (item) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      try {
        await deleteItem(id, item.id);
        setItems((prev) => prev.filter((i) => i.id !== item.id));
      } catch (err) {
        console.error(err);
        setError("Unable to delete item.");
      }
    }
  };

  const fetchItems = async () => {
    try {
      const itemData = await getItemsByLocation(id);
      setItems(itemData);
    } catch (err) {
      console.error(err);
      setError("Items not found.");
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const data = await getLocationById(id);
        setLocation(data);
      } catch (err) {
        console.error(err);
        setError("Location not found.");
      }
    };

    const fetchTags = async () => {
      try {
        const applied = await getTagsByLocation(id);
        setLocationTags(applied);
      } catch (err) {
        console.error(err);
        setError("Tags not found.");
      }
    };

    fetchLocation();
    fetchItems();
    fetchTags();
  }, [id]);

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItemForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();

    try {
      const newItem = await createItem(id, {
        ...itemForm,
        rating: itemForm.rating ? Number(itemForm.rating) : null,
      });
      setItems((prev) => [newItem, ...prev]);
      setItemForm(emptyItemForm);
      setShowItemForm(false);
      setItemError(null);
    } catch (err) {
      console.error(err);
      setItemError("Unable to add item. Please try again.");
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  if (error) {
    return <p className="status status--error">{error}</p>;
  }

  if (!location) {
    return <p className="status">Loading...</p>;
  }

  const categories = [
    "All",
    ...new Set(items.map((i) => i.category).filter(Boolean)),
  ];
  const visibleItems =
    activeCategory === "All"
      ? items
      : items.filter((i) => i.category === activeCategory);

  return (
    <div className="detail-card">
      <header className="detail-card__header">
        <h1>{location.name}</h1>
        <div className="header-actions">
          <Link to={`/locations/${id}/edit`} className="headerBtn">
            Edit
          </Link>
          <button
            type="button"
            className="headerBtn"
            onClick={handleDeleteLocation}
          >
            Delete
          </button>
        </div>
      </header>

      <section className="detail-hero">
        {location.image_url ? (
          <img
            className="detail-hero__image"
            src={location.image_url}
            alt={location.name}
          />
        ) : (
          <div className="detail-hero__image detail-hero__image--empty">🍰</div>
        )}

        <div className="detail-hero__info">
          <span className={location.visited ? "badge badge--visited" : "badge"}>
            {location.visited ? "Visited" : "Want to go"}
          </span>
          <p className="detail-hero__rating">
            {location.rating != null ? (
              <>
                ★ {Number(location.rating).toFixed(1)} <small>/ 5</small>
              </>
            ) : (
              "Not rated yet"
            )}
          </p>
          {location.address && (
            <p className="detail-hero__address">{location.address}</p>
          )}
          {location.notes && (
            <p className="detail-hero__desc">{location.notes}</p>
          )}
        </div>
      </section>

      {locationTags.length > 0 && (
        <section className="tags-section">
          <h2>Tags</h2>
          <div className="tags-container">
            {locationTags.map((tag) => (
              <span
                key={tag.id}
                className="tag-chip tag-chip--active tag-chip--static"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </section>
      )}

      <div className="items-bar">
        <h2>Items</h2>
        <div className="items-bar__filters">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={
                activeCategory === cat
                  ? "filter-pill filter-pill--active"
                  : "filter-pill"
              }
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="add-item-btn"
          onClick={() => setShowItemForm((prev) => !prev)}
        >
          {showItemForm ? "Cancel" : "Add Item"}
        </button>
      </div>

      {showItemForm && (
        <form className="item-form" onSubmit={handleItemSubmit}>
          {itemError && <p className="status status--error">{itemError}</p>}

          <div className="form-field">
            <label htmlFor="item-name">Name</label>
            <input
              id="item-name"
              type="text"
              name="name"
              placeholder="Enter item name"
              value={itemForm.name}
              onChange={handleItemChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="item-category">Category</label>
            <input
              id="item-category"
              type="text"
              name="category"
              placeholder="e.g. Cookie, Pastry, Bread"
              value={itemForm.category}
              onChange={handleItemChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="item-rating">Rating</label>
            <input
              id="item-rating"
              type="number"
              name="rating"
              min="1"
              max="5"
              placeholder="1-5"
              value={itemForm.rating}
              onChange={handleItemChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="item-notes">Notes</label>
            <textarea
              id="item-notes"
              name="notes"
              placeholder="Enter notes"
              value={itemForm.notes}
              onChange={handleItemChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="item-image_url">Image URL</label>
            <input
              id="item-image_url"
              type="text"
              name="image_url"
              placeholder="Enter image URL"
              value={itemForm.image_url}
              onChange={handleItemChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit">Add Item</button>
          </div>
        </form>
      )}

      <div className="item-grid">
        {visibleItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
          />
        ))}
      </div>

      {editingItem && (
        <ItemFormModal
          locationId={id}
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSaved={() => {
            setEditingItem(null);
            fetchItems();
          }}
        />
      )}
    </div>
  );
}

export default LocationDetailPage;
