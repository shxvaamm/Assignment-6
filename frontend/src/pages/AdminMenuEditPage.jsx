import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import MenuItemForm from '../components/MenuItemForm'
import { getMenuItemById, updateMenuItem } from '../api'

function AdminMenuEditPage({ token }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  const fetchItem = useCallback(async () => {
    try {
      setLoading(true)
      setFetchError('')
      const data = await getMenuItemById(id)
      setItem(data)
    } catch (err) {
      setFetchError(err.message || 'Failed to fetch menu item details')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchItem()
  }, [fetchItem])

  const handleUpdate = async (formData) => {
    try {
      setIsSubmitting(true)
      setServerError('')
      await updateMenuItem(id, formData, token)
      navigate('/admin/menu')
    } catch (err) {
      setServerError(err.message || 'Failed to update menu item')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="orders-page-container">
      <div style={{ maxWidth: '640px', margin: '0 auto 1rem auto' }}>
        <Link to="/admin/menu" className="btn-back">
          &larr; Back to Menu List
        </Link>
      </div>

      {fetchError && (
        <div className="status-message error-box" style={{ maxWidth: '640px', margin: '1rem auto' }}>
          <p>⚠️ {fetchError}</p>
          <button type="button" className="btn-retry" onClick={fetchItem}>
            Retry
          </button>
        </div>
      )}

      {serverError && (
        <div className="status-message error-box" style={{ maxWidth: '640px', margin: '1rem auto' }}>
          <p>⚠️ {serverError}</p>
        </div>
      )}

      {loading && (
        <div className="status-message loading-box" style={{ maxWidth: '640px', margin: '2rem auto' }}>
          <p>⏳ Loading dish details...</p>
        </div>
      )}

      {!loading && item && (
        <MenuItemForm
          initialData={item}
          onSubmit={handleUpdate}
          isSubmitting={isSubmitting}
          title={`Edit: ${item.name}`}
          submitButtonText="Update Dish"
        />
      )}
    </div>
  )
}

export default AdminMenuEditPage
