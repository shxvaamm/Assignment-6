import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getAllOrders, updateOrderStatus } from '../api'

function AdminOrdersPage({ token }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [updatingId, setUpdatingId] = useState(null)
  const [actionSuccess, setActionSuccess] = useState('')

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getAllOrders(token, { status: statusFilter })
      setOrders(data)
    } catch (err) {
      setError(err.message || 'Failed to fetch restaurant orders')
    } finally {
      setLoading(false)
    }
  }, [token, statusFilter])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleStatusChange = async (orderId, targetStatus) => {
    try {
      setUpdatingId(orderId)
      setError('')
      setActionSuccess('')
      const result = await updateOrderStatus(orderId, targetStatus, token)
      setActionSuccess(`Order #${orderId.slice(-6)} transitioned to "${targetStatus}".`)
      setOrders((prev) =>
        prev.map((ord) => (ord._id === orderId ? result.order : ord))
      )
    } catch (err) {
      setError(err.message || `Failed to update status to ${targetStatus}`)
    } finally {
      setUpdatingId(null)
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

  const filterOptions = ['All', 'Placed', 'Preparing', 'Served', 'Paid', 'Cancelled']

  return (
    <div className="orders-page-container" style={{ maxWidth: '1000px' }}>
      <div className="orders-header">
        <div>
          <h2>Kitchen &amp; Staff Order Management</h2>
          <p>Live kitchen workflow: Placed &rarr; Preparing &rarr; Served &rarr; Paid</p>
        </div>
        <button type="button" className="btn-refresh" onClick={fetchOrders} disabled={loading}>
          🔄 Refresh Orders
        </button>
      </div>

      {actionSuccess && (
        <div className="orders-success-box">
          <span>✅ {actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="status-message error-box">
          <p>⚠️ {error}</p>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
          padding: '0.75rem',
          backgroundColor: '#fff',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
        }}
      >
        <span style={{ alignSelf: 'center', fontWeight: 600, fontSize: '0.85rem', marginRight: '0.5rem' }}>
          Filter by Status:
        </span>
        {filterOptions.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setStatusFilter(opt)}
            className={`menu-filter-btn ${statusFilter === opt ? 'active' : ''}`}
            style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}
          >
            {opt}
          </button>
        ))}
      </div>

      {loading && (
        <div className="status-message loading-box">
          <p>⏳ Loading live orders...</p>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="status-message empty-box">
          <h3>No Orders Found</h3>
          <p>There are currently no orders matching the selected status filter.</p>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="orders-list">
          {orders.map((order) => {
            const isUpdating = updatingId === order._id

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
                      {' '}&bull; Diner: <strong>{order.customerName || 'Customer'}</strong>
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
                    🧾 View Receipt
                  </Link>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {order.orderStatus === 'Placed' && (
                      <>
                        <button
                          type="button"
                          className="btn-primary"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                          onClick={() => handleStatusChange(order._id, 'Preparing')}
                          disabled={isUpdating}
                        >
                          👨‍🍳 Start Preparing
                        </button>
                        <button
                          type="button"
                          className="btn-cancel-order"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                          onClick={() => handleStatusChange(order._id, 'Cancelled')}
                          disabled={isUpdating}
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {order.orderStatus === 'Preparing' && (
                      <>
                        <button
                          type="button"
                          className="btn-primary"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', backgroundColor: '#2e7d32' }}
                          onClick={() => handleStatusChange(order._id, 'Served')}
                          disabled={isUpdating}
                        >
                          🍲 Mark Served
                        </button>
                        <button
                          type="button"
                          className="btn-cancel-order"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                          onClick={() => handleStatusChange(order._id, 'Cancelled')}
                          disabled={isUpdating}
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {order.orderStatus === 'Served' && (
                      <>
                        <button
                          type="button"
                          className="btn-primary"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', backgroundColor: '#512da8' }}
                          onClick={() => handleStatusChange(order._id, 'Paid')}
                          disabled={isUpdating}
                        >
                          💳 Mark Paid &amp; Clear Table
                        </button>
                        <button
                          type="button"
                          className="btn-cancel-order"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                          onClick={() => handleStatusChange(order._id, 'Cancelled')}
                          disabled={isUpdating}
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {order.orderStatus === 'Paid' && (
                      <span className="user-badge" style={{ backgroundColor: '#ede7f6', color: '#512da8' }}>
                        ✓ Completed &amp; Settled
                      </span>
                    )}

                    {order.orderStatus === 'Cancelled' && (
                      <span className="user-badge" style={{ backgroundColor: '#ffebee', color: '#c62828' }}>
                        ✕ Cancelled
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AdminOrdersPage
