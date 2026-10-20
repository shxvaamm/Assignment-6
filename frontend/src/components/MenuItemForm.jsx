import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function MenuItemForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitButtonText = 'Save Menu Item',
  title = 'Menu Item Form',
}) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Main Course')
  const [price, setPrice] = useState('')
  const [foodType, setFoodType] = useState('Veg')
  const [isAvailable, setIsAvailable] = useState(true)
  const [imageUrl, setImageUrl] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '')
      setCategory(initialData.category || 'Main Course')
      setPrice(initialData.price !== undefined ? String(initialData.price) : '')
      setFoodType(initialData.foodType || 'Veg')
      setIsAvailable(initialData.isAvailable !== undefined ? initialData.isAvailable : true)
      setImageUrl(initialData.imageUrl || '')
      setDescription(initialData.description || '')
    }
  }, [initialData])

  const categories = ['Starters', 'Main Course', 'Beverages', 'Desserts']
  const foodTypes = ['Veg', 'Non-Veg', 'Drink', 'Dessert']

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Please provide a dish name.')
      return
    }

    if (!category) {
      setError('Please select a valid category.')
      return
    }

    if (price === '' || isNaN(Number(price)) || Number(price) < 0) {
      setError('Please provide a valid price (greater than or equal to 0).')
      return
    }

    onSubmit({
      name: name.trim(),
      category,
      price: Number(price),
      foodType,
      isAvailable,
      imageUrl: imageUrl.trim(),
      description: description.trim(),
    })
  }

  return (
    <div className="auth-card" style={{ maxWidth: '640px', margin: '2rem auto' }}>
      <div className="auth-header" style={{ textAlign: 'left' }}>
        <h2>{title}</h2>
        <p>Enter the dish specifications for the restaurant menu.</p>
      </div>

      {error && (
        <div className="auth-error-box">
          <span>⚠️ {error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="item-name">Dish Name *</label>
          <input
            id="item-name"
            type="text"
            placeholder="e.g. Paneer Butter Masala"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label htmlFor="item-category">Category *</label>
            <select
              id="item-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isSubmitting}
              style={{
                padding: '0.7rem 0.9rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: '#ffffff',
                fontSize: '0.95rem',
              }}
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="item-foodtype">Food Type (Veg / Non-Veg) *</label>
            <select
              id="item-foodtype"
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              disabled={isSubmitting}
              style={{
                padding: '0.7rem 0.9rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: '#ffffff',
                fontSize: '0.95rem',
              }}
              required
            >
              {foodTypes.map((ft) => (
                <option key={ft} value={ft}>
                  {ft}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
          <div className="form-group">
            <label htmlFor="item-price">Price (₹) *</label>
            <input
              id="item-price"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g. 250"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem', marginTop: '1.2rem' }}>
            <input
              id="item-availability"
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              disabled={isSubmitting}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <label htmlFor="item-availability" style={{ cursor: 'pointer', margin: 0 }}>
              Available in Kitchen &amp; Menu
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="item-image-url">Image URL (Optional)</label>
          <input
            id="item-image-url"
            type="url"
            placeholder="https://example.com/dish.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        {imageUrl && (
          <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Image Preview:</span>
            <img
              src={imageUrl}
              alt="Dish preview"
              style={{ maxHeight: '120px', maxWidth: '100%', borderRadius: '8px', border: '1px solid var(--border-color)', objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="item-description">Description</label>
          <textarea
            id="item-description"
            rows="3"
            placeholder="Brief ingredients and preparation notes..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            style={{
              padding: '0.7rem 0.9rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <button
            type="submit"
            className="btn-auth-submit"
            style={{ flex: 1 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : submitButtonText}
          </button>
          <Link
            to="/admin/menu"
            className="btn-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              padding: '0.85rem 1.25rem',
              marginTop: '0.5rem',
            }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

export default MenuItemForm
