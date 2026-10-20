import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getDashboardStats } from '../api'

function AdminDashboardPage({ token, user }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getDashboardStats(token)
      setStats(data)
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard metrics')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const isAdmin = user && user.role === 'admin'

  return (
    <div className="orders-page-container" style={{ maxWidth: '1060px' }}>
      <div className="orders-header">
        <div>
          <h2>Restaurant Operations Dashboard</h2>
          <p>Real-time analytics and performance metrics computed directly from MongoDB.</p>
        </div>
        <button type="button" className="btn-refresh" onClick={fetchStats} disabled={loading}>
          🔄 Refresh Metrics
        </button>
      </div>

      {error && (
        <div className="status-message error-box">
          <p>⚠️ {error}</p>
          <button type="button" className="btn-retry" onClick={fetchStats}>
            Retry
          </button>
        </div>
      )}

      {loading && (
        <div className="status-message loading-box">
          <p>⏳ Aggregating live sales and operational statistics...</p>
        </div>
      )}

      {!loading && stats && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div className="auth-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Today's Orders
              </span>
              <h3 style={{ fontSize: '2rem', color: 'var(--primary-color)', margin: '0.35rem 0' }}>
                {stats.today.orderCount}
              </h3>
              <small style={{ color: 'var(--text-muted)' }}>Placed since 00:00:00 today</small>
            </div>

            <div className="auth-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Today's Revenue
              </span>
              <h3 style={{ fontSize: '2rem', color: '#2e7d32', margin: '0.35rem 0' }}>
                ₹{stats.today.revenue.toFixed(2)}
              </h3>
              <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: '1.2', display: 'block' }}>
                {stats.today.revenueRule}
              </small>
            </div>

            <div className="auth-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Active Kitchen Orders
              </span>
              <h3 style={{ fontSize: '2rem', color: '#f57f17', margin: '0.35rem 0' }}>
                {stats.activeOrdersCount}
              </h3>
              <small style={{ color: 'var(--text-muted)' }}>Placed, Preparing, or Served</small>
            </div>

            <div className="auth-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Occupied Tables
              </span>
              <h3 style={{ fontSize: '2rem', color: '#1565c0', margin: '0.35rem 0' }}>
                {stats.occupiedTablesCount}
              </h3>
              <small style={{ color: 'var(--text-muted)' }}>Tables currently seated</small>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '2rem',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to="/admin/orders"
              className="btn-primary"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              📋 Open Order Management
            </Link>
            {isAdmin && (
              <>
                <Link
                  to="/admin/menu"
                  className="btn-secondary"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  🍽️ Manage Dishes
                </Link>
                <Link
                  to="/admin/tables"
                  className="btn-secondary"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  🪑 Manage Tables
                </Link>
              </>
            )}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <div
              className="auth-card"
              style={{
                maxWidth: '100%',
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🔥 Top 5 Selling Items
              </h3>

              {stats.topSellingItems.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No item sales recorded yet. Completed orders will appear here.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {stats.topSellingItems.map((item, index) => (
                    <div
                      key={item.name}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.65rem 0.85rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: index === 0 ? '#ffeb3b' : '#e2e8f0',
                            color: '#2d3748',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                          }}
                        >
                          {index + 1}
                        </span>
                        <strong>{item.name}</strong>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>
                          {item.quantitySold} sold
                        </span>
                        <small style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          ₹{item.totalRevenue.toFixed(2)}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              className="auth-card"
              style={{
                maxWidth: '100%',
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📊 Category-Wise Sales
              </h3>

              {stats.categorySales.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No category sales recorded yet. Completed orders will populate this view.
                </p>
              ) : (
                <table className="receipt-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Qty Sold</th>
                      <th style={{ textAlign: 'right' }}>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.categorySales.map((cat) => (
                      <tr key={cat.category}>
                        <td>
                          <span className="table-badge">{cat.category}</span>
                        </td>
                        <td>{cat.itemsSold} items</td>
                        <td style={{ textAlign: 'right', fontWeight: 600, color: '#2e7d32' }}>
                          ₹{cat.revenue.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminDashboardPage
