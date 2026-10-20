import { useEffect, useState, useCallback } from 'react'
import { getTables, createTable, updateTable, deleteTable } from '../api'

function AdminTablesPage({ token }) {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionSuccess, setActionSuccess] = useState('')

  const [newTableNum, setNewTableNum] = useState('')
  const [newCapacity, setNewCapacity] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  const [editingTable, setEditingTable] = useState(null)
  const [editCapacity, setEditCapacity] = useState('')
  const [editStatus, setEditStatus] = useState('Available')
  const [isUpdating, setIsUpdating] = useState(false)
  const [editError, setEditError] = useState('')

  const fetchTables = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getTables()
      setTables(data)
    } catch (err) {
      setError(err.message || 'Failed to fetch restaurant tables')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTables()
  }, [fetchTables])

  const handleCreateTable = async (e) => {
    e.preventDefault()
    setCreateError('')
    setActionSuccess('')

    if (!newTableNum || Number(newTableNum) < 1) {
      setCreateError('Please provide a valid table number (1 or higher).')
      return
    }

    if (!newCapacity || Number(newCapacity) < 1) {
      setCreateError('Please provide a valid seating capacity (1 or higher).')
      return
    }

    try {
      setIsCreating(true)
      const data = await createTable(
        {
          tableNumber: Number(newTableNum),
          capacity: Number(newCapacity),
          status: 'Available',
        },
        token
      )
      setTables((prev) => [...prev, data].sort((a, b) => a.tableNumber - b.tableNumber))
      setActionSuccess(`Table #${data.tableNumber} added successfully.`)
      setNewTableNum('')
      setNewCapacity('')
    } catch (err) {
      setCreateError(err.message || 'Failed to add table')
    } finally {
      setIsCreating(false)
    }
  }

  const handleStartEdit = (table) => {
    setEditingTable(table)
    setEditCapacity(String(table.capacity))
    setEditStatus(table.status)
    setEditError('')
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    setEditError('')
    setActionSuccess('')

    if (!editCapacity || Number(editCapacity) < 1) {
      setEditError('Capacity must be at least 1 seat.')
      return
    }

    try {
      setIsUpdating(true)
      const updated = await updateTable(
        editingTable._id,
        {
          capacity: Number(editCapacity),
          status: editStatus,
        },
        token
      )
      setTables((prev) => prev.map((t) => (t._id === updated._id ? updated : t)))
      setActionSuccess(`Table #${updated.tableNumber} updated successfully.`)
      setEditingTable(null)
    } catch (err) {
      setEditError(err.message || 'Failed to update table')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteTable = async (id, tableNumber) => {
    if (!window.confirm(`Are you sure you want to delete Table #${tableNumber}?`)) {
      return
    }

    try {
      setError('')
      setActionSuccess('')
      await deleteTable(id, token)
      setTables((prev) => prev.filter((t) => t._id !== id))
      setActionSuccess(`Table #${tableNumber} deleted successfully.`)
    } catch (err) {
      setError(err.message || 'Failed to delete table')
    }
  }

  return (
    <div className="orders-page-container" style={{ maxWidth: '960px' }}>
      <div className="orders-header">
        <div>
          <h2>Dining Table Management</h2>
          <p>Configure tables, seating capacities, and live table status.</p>
        </div>
        <button type="button" className="btn-refresh" onClick={fetchTables}>
          🔄 Refresh Tables
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
        className="auth-card"
        style={{
          maxWidth: '100%',
          marginBottom: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>Add New Dining Table</h3>
        {createError && (
          <div className="auth-error-box" style={{ marginBottom: '1rem' }}>
            <span>⚠️ {createError}</span>
          </div>
        )}
        <form
          onSubmit={handleCreateTable}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'flex-end' }}
        >
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="new-table-num">Table Number *</label>
            <input
              id="new-table-num"
              type="number"
              min="1"
              placeholder="e.g. 5"
              value={newTableNum}
              onChange={(e) => setNewTableNum(e.target.value)}
              disabled={isCreating}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="new-capacity">Seating Capacity (Guests) *</label>
            <input
              id="new-capacity"
              type="number"
              min="1"
              placeholder="e.g. 4"
              value={newCapacity}
              onChange={(e) => setNewCapacity(e.target.value)}
              disabled={isCreating}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ padding: '0.75rem 1.25rem', height: '42px', display: 'flex', alignItems: 'center' }}
            disabled={isCreating}
          >
            {isCreating ? 'Adding...' : '➕ Add Table'}
          </button>
        </form>
      </div>

      {editingTable && (
        <div className="modal-backdrop">
          <div className="order-confirmation-card" style={{ maxWidth: '440px' }}>
            <div className="confirmation-header">
              <h2>Edit Table #{editingTable.tableNumber}</h2>
              <p className="order-id-tag">Update seating capacity and table state.</p>
            </div>

            {editError && (
              <div className="auth-error-box">
                <span>⚠️ {editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="auth-form">
              <div className="form-group">
                <label htmlFor="edit-capacity">Capacity (Seats)</label>
                <input
                  id="edit-capacity"
                  type="number"
                  min="1"
                  value={editCapacity}
                  onChange={(e) => setEditCapacity(e.target.value)}
                  disabled={isUpdating}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-status">Table Status</label>
                <select
                  id="edit-status"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  disabled={isUpdating}
                  style={{
                    padding: '0.7rem 0.9rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.95rem',
                  }}
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Reserved">Reserved</option>
                </select>
                <small style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Note: A table with active orders cannot be forced to 'Available'.
                </small>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  className="btn-auth-submit"
                  style={{ flex: 1 }}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '0.85rem 1.25rem', marginTop: '0.5rem' }}
                  onClick={() => setEditingTable(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && (
        <div className="status-message loading-box">
          <p>⏳ Loading dining tables...</p>
        </div>
      )}

      {!loading && !error && tables.length === 0 && (
        <div className="status-message empty-box">
          <h3>No Tables Found</h3>
          <p>Create your first dining table above to begin seating customers.</p>
        </div>
      )}

      {!loading && !error && tables.length > 0 && (
        <div
          className="admin-table-wrapper"
          style={{
            overflowX: 'auto',
            backgroundColor: '#fff',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <table className="receipt-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Table</th>
                <th>Seating Capacity</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tables.map((table) => (
                <tr key={table._id || table.tableNumber}>
                  <td>
                    <strong style={{ fontSize: '1.05rem' }}>Table #{table.tableNumber}</strong>
                  </td>
                  <td>👥 {table.capacity} Guests</td>
                  <td>
                    <span
                      className={`status-badge ${
                        table.status === 'Available'
                          ? 'status-served'
                          : table.status === 'Occupied'
                          ? 'status-placed'
                          : 'status-preparing'
                      }`}
                    >
                      {table.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(table)}
                        className="btn-view-details"
                        style={{ padding: '0.35rem 0.65rem' }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTable(table._id, table.tableNumber)}
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

export default AdminTablesPage
