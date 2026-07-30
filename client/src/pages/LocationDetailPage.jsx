import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLocationById } from "../services/locationsApi";
import { getItemsByLocation } from "../services/itemsApi";
import ItemCard from "../components/ItemCard";
import "../css/LocationDetailPage.css";

function LocationDetailPage() {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [error, setError] = useState(null);

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

    const fetchItems = async () => {
      try {
        const itemData = await getItemsByLocation(id);
        setItems(itemData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLocation();
    fetchItems();
  }, [id]);

  if (error) {
    return <p className="status status--error">{error}</p>;
  }

  if (!location) {
    return <p className="status">Loading...</p>;
  }

  const categories = ["All", ...new Set(items.map((i) => i.category).filter(Boolean))];
  const visibleItems =
    activeCategory === "All"
      ? items
      : items.filter((i) => i.category === activeCategory);

  const handleEditItem = (item) => {
    // No item-edit route exists yet, placeholder until an item form is built.
    console.warn("Item editing isn't wired to a page yet:", item);
  };

  const handleAddItem = () => {
    // No item form/route exists yet, placeholder button.
    console.warn("Add item isn't wired to a page yet.");
  };

  return (
    <div className="detail-card">
      <header className="detail-card__header">
        <h1>{location.name}</h1>
        <Link to={`/locations/${id}/edit`} className="headerBtn">
          Edit
        </Link>
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
          {location.notes && <p className="detail-hero__desc">{location.notes}</p>}
        </div>
      </section>

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
        <button type="button" className="add-item-btn" onClick={handleAddItem}>
          add
        </button>
      </div>

      <div className="item-grid">
        {visibleItems.map((item) => (
          <ItemCard key={item.id} item={item} onEdit={handleEditItem} />
        ))}
      </div>
    </div>
  );
}

export default LocationDetailPage;
