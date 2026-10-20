import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MenuItemForm from '../components/MenuItemForm'
import { createMenuItem } from '../api'

function AdminMenuNewPage({ token }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()

  const handleCreate = async (formData) => {
    try {
      setIsSubmitting(true)
      setServerError('')
      await createMenuItem(formData, token)
      navigate('/admin/menu')
    } catch (err) {
      setServerError(err.message || 'Failed to create menu item')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="orders-page-container">
      {serverError && (
        <div className="status-message error-box" style={{ maxWidth: '640px', margin: '1rem auto' }}>
          <p>⚠️ {serverError}</p>
        </div>
      )}
      <MenuItemForm
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
        title="Add New Menu Item"
        submitButtonText="Create Dish"
      />
    </div>
  )
}

export default AdminMenuNewPage
