import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getMyOrders, cancelOrder } from '../api'

function MyOrdersPage({ token }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState(null)
  const [actionMessage, setActionMessage] = useState('')

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getMyOrders(token)
      setOrders(data)
    } catch (err) {
      setError(err.message || 'Failed to load your orders.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return
    }

    try {
      setCancellingId(orderId)
      setActionMessage('')
      await cancelOrder(orderId, token)
      setActionMessage(`Order #${orderId.slice(-6)} has been cancelled successfully.`)
      await fetchOrders()
    } catch (err) {
      setError(err.message || 'Failed to cancel the order.')
    } finally {
      setCancellingId(null)
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'Placed':
        return 'status-placed'
      case 'Preparing':
        return 'status-preparing'
      case 'Served':
        return 'status-served'
      case 'Paid':
        return 'status-paid'
      case 'Cancelled':
        return 'status-cancelled'
      default:
        return 'status-default'
    }
  }

  return (
    <div className="orders-page-container">
      <div className="orders-header">
        <div>
          <h2>My Dining Orders</h2>
          <p>Track your table orders and itemised bill in real-time.</p>
        </div>
        <button
          type="button"
          className="btn-refresh"
          onClick={fetchOrders}
          disabled={loading}
        >
          🔄 Refresh
        </button>
      </div>

      {actionMessage && (
        <div className="orders-success-box">
          <span>✅ {actionMessage}</span>
        </div>
      )}

      {error && (
        <div className="status-message error-box">
          <p>⚠️ {error}</p>
          <button type="button" className="btn-retry" onClick={fetchOrders}>
            Retry
          </button>
        </div>
      )}

      {loading && (
        <div className="status-message loading-box">
          <p>⏳ Fetching your past and current orders...</p>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="status-message empty-box">
          <h3>No Orders Found</h3>
          <p>You have not placed any table orders yet.</p>
          <Link to="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
            Browse Menu &amp; Order Now
          </Link>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="orders-list">
          {orders.map((order) => {
            const isPlaced = order.orderStatus === 'Placed'
            const isCancelling = cancellingId === order._id

            return (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <span className="order-id-label">Order #{order._id.slice(-6)}</span>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="order-badges">
                    <span className="table-badge">Table #{order.tableNumber}</span>
                    <span className={`status-badge ${getStatusClass(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="order-card-items">
                  <h4>Ordered Dishes</h4>
                  <ul>
                    {order.items.map((item, idx) => (
                      <li key={idx} className="order-dish-row">
                        <span>
                          {item.name} &times; {item.quantity}
                        </span>
                        <span className="dish-row-price">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="order-card-billing">
                  <div className="bill-summary-row">
                    <span>Subtotal:</span>
                    <span>₹{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="bill-summary-row">
                    <span>GST (5%):</span>
                    <span>₹{order.tax.toFixed(2)}</span>
                  </div>
                  <div className="bill-summary-row grand-total-row">
                    <span>Grand Total:</span>
                    <span className="grand-price">₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="order-card-actions">
                  <Link to={`/orders/${order._id}`} className="btn-view-details">
                    View Bill &amp; Receipt
                  </Link>
                  {isPlaced ? (
                    <button
                      type="button"
                      className="btn-cancel-order"
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={isCancelling}
                    >
                      {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  ) : (
                    <span className="cancel-disabled-notice">
                      {order.orderStatus === 'Cancelled' ? 'Order Cancelled' : 'Cannot cancel (in kitchen)'}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyOrdersPage
