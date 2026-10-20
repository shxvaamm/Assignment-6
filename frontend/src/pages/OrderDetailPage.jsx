import { useEffect, useState, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getOrderById, cancelOrder } from '../api'

function OrderDetailPage({ token }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isCancelling, setIsCancelling] = useState(false)
  const [cancelSuccess, setCancelSuccess] = useState('')

  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getOrderById(id, token)
      setOrder(data)
    } catch (err) {
      setError(err.message || 'Failed to fetch order details.')
    } finally {
      setLoading(false)
    }
  }, [id, token])

  useEffect(() => {
    fetchOrderDetails()
  }, [fetchOrderDetails])

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return
    }

    try {
      setIsCancelling(true)
      setCancelSuccess('')
      await cancelOrder(id, token)
      setCancelSuccess('Order has been cancelled successfully.')
      await fetchOrderDetails()
    } catch (err) {
      setError(err.message || 'Failed to cancel the order.')
    } finally {
      setIsCancelling(false)
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
    <div className="order-detail-container">
      <div className="order-detail-nav">
        <Link to="/my-orders" className="btn-back">
          &larr; Back to My Orders
        </Link>
        <Link to="/" className="btn-secondary">
          Browse Menu
        </Link>
      </div>

      {cancelSuccess && (
        <div className="orders-success-box">
          <span>✅ {cancelSuccess}</span>
        </div>
      )}

      {error && (
        <div className="status-message error-box">
          <p>⚠️ {error}</p>
          <div style={{ marginTop: '0.8rem' }}>
            <button type="button" className="btn-retry" onClick={fetchOrderDetails}>
              Retry
            </button>
            <button
              type="button"
              className="btn-secondary"
              style={{ marginLeft: '0.5rem' }}
              onClick={() => navigate('/my-orders')}
            >
              Go to My Orders
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="status-message loading-box">
          <p>⏳ Loading receipt and order details...</p>
        </div>
      )}

      {!loading && order && (
        <div className="receipt-card">
          <div className="receipt-header">
            <span className="brand-icon" style={{ fontSize: '2rem' }}>🍽️</span>
            <h2>Campus Bites Restaurant</h2>
            <p className="receipt-subtitle">Official Dining Receipt &bull; Table Ordering</p>
          </div>

          <div className="receipt-meta-grid">
            <div className="meta-box">
              <span className="meta-label">Order Reference:</span>
              <span className="meta-value font-mono">{order._id}</span>
            </div>
            <div className="meta-box">
              <span className="meta-label">Dining Table:</span>
              <span className="meta-value table-highlight">Table #{order.tableNumber}</span>
            </div>
            <div className="meta-box">
              <span className="meta-label">Order Placed At:</span>
              <span className="meta-value">
                {new Date(order.createdAt).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
            </div>
            <div className="meta-box">
              <span className="meta-label">Current Status:</span>
              <span className={`status-badge ${getStatusClass(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
            </div>
            <div className="meta-box">
              <span className="meta-label">Customer Name:</span>
              <span className="meta-value">{order.customerName || 'Customer'}</span>
            </div>
            <div className="meta-box">
              <span className="meta-label">Payment Status:</span>
              <span className="meta-value">{order.paymentStatus || 'Unpaid'}</span>
            </div>
          </div>

          <div className="receipt-items-section">
            <h3>Itemised Bill</h3>
            <table className="receipt-table">
              <thead>
                <tr>
                  <th>Dish Name</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td className="dish-name-cell">{item.name}</td>
                    <td>₹{item.price.toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td style={{ textAlign: 'right' }}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="receipt-totals-section">
            <div className="receipt-total-row">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="receipt-total-row">
              <span>GST (5%)</span>
              <span>₹{order.tax.toFixed(2)}</span>
            </div>
            <div className="receipt-total-row final-grand-total">
              <span>Grand Total</span>
              <span>₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="receipt-actions">
            {order.orderStatus === 'Placed' && (
              <button
                type="button"
                className="btn-cancel-order"
                onClick={handleCancel}
                disabled={isCancelling}
              >
                {isCancelling ? 'Cancelling Order...' : 'Cancel Order'}
              </button>
            )}
            <button
              type="button"
              className="btn-print"
              onClick={() => window.print()}
            >
              🖨️ Print Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetailPage
