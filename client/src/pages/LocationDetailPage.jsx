import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"
import { getLocationById } from "../services/locationsApi";
import { getItemsByLocation } from "../services/itemsApi";
import ItemCard from "../components/ItemCard";
import "../css/LocationDetailPage.css";

function LocationDetailPage() {
    const { id } = useParams();
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [items, setItems] = useState([]);

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
                setError("Items not found.");
            }
        }
    
        fetchLocation();
        fetchItems();
    }, [id]);

    if (!location) {
        return <p>Loading...</p>;
    }

    if (error) {
    return <p className="status status--error">{error}</p>;
  }

    return (
        <div>
            <div className="location-header">
                <div className="location-name">
                <h1>{location.name}</h1>
                <span className={location.visited ? "badge badge--visited" : "badge"}>
                        {location.visited ? "Visited" : "Want to go"}
                </span>
                <Link to={`/locations/${id}/edit`} className="headerBtn">
                    Edit Location
                </Link>
                </div>
                
                {location.image_url ? (
                    <img className="location-card__image" src={location.image_url} alt={location.name} />
                ) : (
                    <div className="location-card__image location-card__image--empty">
                    🍰
                    </div>
                )}
                <h2>{location.address}</h2>
                <p>{location.notes}</p>
            </div>
            
            <div className="items-container">
                <h2>Items</h2>
                <div className="location-grid">
                    {items.map((item) => (
                        <ItemCard item={item} />
                    ))}

                </div>
            </div>
        </div>
    
    )

}

export default LocationDetailPage