function OrderConfirmationModal({ order, onClose }) {
  if (!order) return null

  return (
    <div className="modal-backdrop">
      <div className="order-confirmation-card">
        <div className="confirmation-header">
          <span className="celebration-icon">🎉</span>
          <h2>Order Placed Successfully!</h2>
          <p className="order-id-tag">Order ID: #{order._id}</p>
        </div>

        <div className="confirmation-meta">
          <div className="meta-box">
            <span className="meta-title">Table Number</span>
            <strong className="meta-value">Table #{order.tableNumber}</strong>
          </div>
          <div className="meta-box">
            <span className="meta-title">Customer</span>
            <strong className="meta-value">{order.customerName || 'Guest Diner'}</strong>
          </div>
          <div className="meta-box">
            <span className="meta-title">Order Status</span>
            <strong className="meta-status-pill">{order.orderStatus}</strong>
          </div>
        </div>

        <div className="ordered-items-summary">
          <h3>Items Ordered:</h3>
          <div className="ordered-items-table">
            {order.items.map((item, index) => (
              <div key={item.menuItem || index} className="ordered-item-row">
                <span className="ordered-item-name">
                  {item.name} &times; {item.quantity}
                </span>
                <span className="ordered-item-price">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="confirmation-bill">
          <div className="bill-row">
            <span>Items Subtotal:</span>
            <span>₹{order.subtotal.toFixed(2)}</span>
          </div>
          <div className="bill-row">
            <span>5% GST (Tax):</span>
            <span>₹{order.tax.toFixed(2)}</span>
          </div>
          <div className="bill-row bill-total">
            <strong>Grand Total:</strong>
            <strong>₹{order.totalAmount.toFixed(2)}</strong>
          </div>
        </div>

        <div className="confirmation-note">
          <p>
            👨‍🍳 Your order has been sent straight to the kitchen. Kitchen staff will prepare your dishes shortly.
          </p>
        </div>

        <div className="confirmation-modal-actions">
          <a href={`/orders/${order._id}`} className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none' }}>
            🧾 View Itemised Receipt
          </a>
          <button type="button" className="btn-close-confirmation" onClick={onClose}>
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmationModal
