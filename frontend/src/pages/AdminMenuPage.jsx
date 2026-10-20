import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getMenuItems, toggleMenuItemAvailability, deleteMenuItem } from '../api'

function AdminMenuPage({ token }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionSuccess, setActionSuccess] = useState('')

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getMenuItems()
      setItems(data)
    } catch (err) {
      setError(err.message || 'Failed to load menu items')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleToggle = async (id, currentStatus) => {
    try {
      setActionSuccess('')
      await toggleMenuItemAvailability(id, token)
      setItems((prev) =>
        prev.map((it) => (it._id === id ? { ...it, isAvailable: !currentStatus } : it))
      )
      setActionSuccess('Item availability updated.')
    } catch (err) {
      setError(err.message || 'Failed to update availability')
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the menu?`)) {
      return
    }

    try {
      setActionSuccess('')
      await deleteMenuItem(id, token)
      setItems((prev) => prev.filter((it) => it._id !== id))
      setActionSuccess(`"${name}" was deleted successfully.`)
    } catch (err) {
      setError(err.message || 'Failed to delete menu item')
    }
  }

  return (
    <div className="orders-page-container" style={{ maxWidth: '1000px' }}>
      <div className="orders-header">
        <div>
          <h2>Menu Management</h2>
          <p>Add, edit, delete, and control availability of dishes in real-time.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="button" className="btn-refresh" onClick={fetchItems}>
            🔄 Refresh
          </button>
          <Link to="/admin/menu/new" className="btn-primary" style={{ textDecoration: 'none' }}>
            ➕ Add New Dish
          </Link>
        </div>
      </div>

      {actionSuccess && (
        <div className="orders-success-box">
          <span>✅ {actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="status-message error-box">
          <p>⚠️ {error}</p>
          <button type="button" className="btn-retry" onClick={fetchItems}>
            Retry
          </button>
        </div>
      )}

      {loading && (
        <div className="status-message loading-box">
          <p>⏳ Loading restaurant menu items...</p>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="status-message empty-box">
          <h3>No Menu Items Found</h3>
          <p>The menu is currently empty. Click below to add your first dish.</p>
          <Link to="/admin/menu/new" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
            ➕ Add First Dish
          </Link>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="admin-table-wrapper" style={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <table className="receipt-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Dish</th>
                <th>Category</th>
                <th>Type</th>
                <th>Price</th>
                <th>Availability</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover' }}
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      ) : (
                        <span style={{ fontSize: '1.5rem' }}>🍽️</span>
                      )}
                      <div>
                        <strong>{item.name}</strong>
                        {item.description && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                            {item.description.slice(0, 50)}{item.description.length > 50 ? '...' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="table-badge">{item.category}</span>
                  </td>
                  <td>
                    <span
                      className={`foodtype-pill ${
                        item.foodType === 'Veg'
                          ? 'badge-veg'
                          : item.foodType === 'Non-Veg'
                          ? 'badge-nonveg'
                          : 'badge-drink'
                      }`}
                    >
                      {item.foodType}
                    </span>
                  </td>
                  <td>
                    <strong>₹{item.price.toFixed(2)}</strong>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleToggle(item._id, item.isAvailable)}
                      className={`status-badge ${item.isAvailable ? 'status-served' : 'status-cancelled'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                      title="Click to toggle availability"
                    >
                      {item.isAvailable ? '✓ Available' : '✕ Out of Stock'}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <Link
                        to={`/admin/menu/${item._id}/edit`}
                        className="btn-view-details"
                        style={{ padding: '0.35rem 0.65rem' }}
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(item._id, item.name)}
                        className="btn-clear-cart"
                        style={{ padding: '0.35rem 0.65rem' }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminMenuPage
