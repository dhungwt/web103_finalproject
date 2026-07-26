function ItemCard({ item }) {
  const { name, category, rating, notes, image_url } = item;

  return (
    <div className="location-card">
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
          <span>{category}</span>
        </div>
        <p>Rating: {rating}/5</p>
        {notes && <p className="location-card__notes">{notes}</p>}
      </div>
    </div>
  );
}

export default ItemCard;
