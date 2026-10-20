function Cart({
  cartItems,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
  onClearCart,
  selectedTable,
  isSubmitting,
  orderError,
  onPlaceOrder,
}) {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  const isOrderDisabled =
    cartItems.length === 0 || !selectedTable || isSubmitting

  return (
    <section className="cart-section" id="cart">
      <div className="cart-header">
        <h2>Your Table Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})</h2>
        {cartItems.length > 0 && (
          <button type="button" className="btn-clear-cart" onClick={onClearCart}>
            Clear Cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty. Pick dishes from the menu above to start your table order.</p>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item-row">
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <span className="cart-item-unit-price">₹{item.price} each</span>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button
                      type="button"
                      className="btn-qty"
                      onClick={() => onDecreaseQuantity(item._id)}
                      title="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="qty-count">{item.quantity}</span>
                    <button
                      type="button"
                      className="btn-qty"
                      onClick={() => onIncreaseQuantity(item._id)}
                      title="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <span className="cart-item-total-price">
                    ₹{item.price * item.quantity}
                  </span>
                  <button
                    type="button"
                    className="btn-remove-item"
                    onClick={() => onRemoveItem(item._id)}
                    title="Remove item"
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary-box">
            <div className="summary-line">
              <span>Cart Subtotal (Estimated):</span>
              <strong>₹{subtotal}</strong>
            </div>

            <div className="table-link-summary">
              {selectedTable ? (
                <span className="table-linked-tag">
                  🎯 Table Selected: <strong>Table #{selectedTable}</strong>
                </span>
              ) : (
                <span className="table-unlinked-tag">
                  ⚠️ No table selected. Choose a table in the section above before placing your order.
                </span>
              )}
            </div>

            <p className="cart-gst-notice">
              Note: Final subtotal, 5% GST, and grand total will be calculated securely on the backend when you place the order.
            </p>

            {orderError && (
              <div className="order-error-alert">
                ⚠️ {orderError}
              </div>
            )}

            <button
              type="button"
              className={`btn-place-order ${isOrderDisabled ? 'btn-disabled' : ''}`}
              disabled={isOrderDisabled}
              onClick={onPlaceOrder}
            >
              {isSubmitting
                ? '⏳ Placing Order...'
                : !selectedTable
                ? '⚠️ Select Table to Place Order'
                : `Place Order for Table #${selectedTable}`}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default Cart
