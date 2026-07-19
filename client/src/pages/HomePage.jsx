import { useEffect, useState } from "react";
import { getLocations } from "../services/locationsApi";
import LocationCard from "../components/LocationCard";

function HomePage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const data = await getLocations();
        setLocations(data);
      } catch (err) {
        console.error(err);
        setError("Could not load your bucket list. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, []);

  if (loading) {
    return <p className="status">Loading your bucket list...</p>;
  }

  if (error) {
    return <p className="status status--error">{error}</p>;
  }

  return (
    <section>
      <div className="page-heading">
        <h1>Your Bucket List</h1>
        <p>
          {locations.length} {locations.length === 1 ? "place" : "places"} saved
        </p>
      </div>

      {locations.length === 0 ? (
        <p className="status">
          No places yet. Add your first bakery to get started!
        </p>
      ) : (
        <div className="location-grid">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      )}
    </section>
  );
}

export default HomePage;
