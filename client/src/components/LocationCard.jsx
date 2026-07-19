import { Link } from "react-router-dom";

function LocationCard({ location }) {
  const { id, name, address, notes, image_url, visited } = location;

  return (
    <Link to={`/locations/${id}`} className="location-card">
      {image_url ? (
        <img className="location-card__image" src={image_url} alt={name} />
      ) : (
        <div className="location-card__image location-card__image--empty">
          🍰
        </div>
      )}

      <div className="location-card__body">
        <div className="location-card__heading">
          <h2>{name}</h2>
          <span className={visited ? "badge badge--visited" : "badge"}>
            {visited ? "Visited" : "Want to go"}
          </span>
        </div>

        {address && <p className="location-card__address">{address}</p>}
        {notes && <p className="location-card__notes">{notes}</p>}
      </div>
    </Link>
  );
}

export default LocationCard;
