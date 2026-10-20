function MenuItemCard({ item, onAddToCart }) {
  const isAvailable = item.isAvailable !== false

  return (
    <div className={`menu-card ${!isAvailable ? 'card-unavailable' : ''}`}>
      <div className="menu-card-top">
        <div className="badge-row">
          <span
            className={`item-badge ${
              item.foodType === 'Drink'
                ? 'badge-drink'
                : item.foodType === 'Non-Veg'
                ? 'badge-nonveg'
                : 'badge-veg'
            }`}
          >
            {item.foodType}
          </span>
          <span
            className={`status-badge ${
              isAvailable ? 'badge-available' : 'badge-unavailable'
            }`}
          >
            {isAvailable ? 'Available' : 'Out of Stock'}
          </span>
        </div>
        <h4>{item.name}</h4>
        <p className="item-description">{item.description}</p>
      </div>
      <div className="menu-card-bottom">
        <span className="item-price">₹{item.price}</span>
        {isAvailable ? (
          <button
            type="button"
            className="btn-add-item"
            onClick={() => onAddToCart(item)}
          >
            + Add to Cart
          </button>
        ) : (
          <button
            type="button"
            className="btn-add-item disabled"
            disabled
            title="This item is currently unavailable"
          >
            Unavailable
          </button>
        )}
      </div>
    </div>
  )
}

export default MenuItemCard
