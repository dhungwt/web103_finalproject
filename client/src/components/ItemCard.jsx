function ItemCard({ item, onEdit, onDelete }) {
  const { name, rating, image_url } = item;

  return (
    <div className="item-card">
      <div className="item-card__media">
        {image_url ? (
          <img src={image_url} alt={name} />
        ) : (
          <div className="item-card__placeholder">🍰</div>
        )}
        {onEdit && (
          <button
            type="button"
            className="item-card__action"
            onClick={() => onEdit(item)}
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            className="item-card__action"
            onClick={() => onDelete(item)}
          >
            Delete
          </button>
        )}
      </div>

      <div className="item-card__footer">
        <span className="item-card__name">{name}</span>
        {rating != null && (
          <span className="item-card__rating">★ {rating}</span>
        )}
      </div>
    </div>
  );
}

export default ItemCard;
