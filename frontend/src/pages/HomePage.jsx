import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MenuSearch from '../components/MenuSearch'
import MenuFilter from '../components/MenuFilter'
import MenuItemCard from '../components/MenuItemCard'
import TableSelector from '../components/TableSelector'
import Cart from '../components/Cart'
import OrderConfirmationModal from '../components/OrderConfirmationModal'
import { getMenuItems, getTables, placeOrder } from '../api'

function HomePage({ user, token, cart, setCart }) {
  const [menuItems, setMenuItems] = useState([])
  const [loadingMenu, setLoadingMenu] = useState(true)
  const [menuError, setMenuError] = useState('')

  const [tables, setTables] = useState([])
  const [loadingTables, setLoadingTables] = useState(true)
  const [selectedTable, setSelectedTable] = useState(null)
  const [customerName, setCustomerName] = useState(user ? user.name : '')

  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [vegOnly, setVegOnly] = useState(false)

  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [placedOrder, setPlacedOrder] = useState(null)

  const navigate = useNavigate()

  const refreshTables = () => {
    getTables()
      .then((data) => setTables(data))
      .catch(() => setTables([]))
  }

  useEffect(() => {
    let isMounted = true

    getMenuItems()
      .then((data) => {
        if (isMounted) {
          setMenuItems(data)
          setLoadingMenu(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setMenuError(err.message || 'Failed to load menu from server')
          setLoadingMenu(false)
        }
      })

    getTables()
      .then((data) => {
        if (isMounted) {
          setTables(data)
          setLoadingTables(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          setTables([])
          setLoadingTables(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const categories = ['All', 'Starters', 'Main Course', 'Beverages', 'Desserts']

  const displayedItems = menuItems.filter((item) => {
    const matchesCategory =
      activeCategory === 'All' || item.category === activeCategory
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(search.toLowerCase()))
    const matchesVeg = !vegOnly || item.foodType === 'Veg'

    return matchesCategory && matchesSearch && matchesVeg
  })

  const handleAddToCart = (item) => {
    if (item.isAvailable === false) {
      return
    }

    setCart((prevCart) => {
      const existing = prevCart.find((cartItem) => cartItem._id === item._id)
      if (existing) {
        return prevCart.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }
      return [
        ...prevCart,
        {
          _id: item._id,
          name: item.name,
          price: item.price,
          foodType: item.foodType,
          quantity: 1,
        },
      ]
    })
  }

  const handleIncreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  const handleDecreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item._id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const handleRemoveItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id))
  }

  const handleClearCart = () => {
    setCart([])
  }

  const handlePlaceOrder = async () => {
    if (!user) {
      setOrderError('Please sign in or register to place your order.')
      navigate('/login', { state: { from: { pathname: '/' } } })
      return
    }

    if (!selectedTable) {
      setOrderError('Please select an available dining table before ordering.')
      return
    }

    if (cart.length === 0) {
      setOrderError('Your cart is empty. Add dishes to place an order.')
      return
    }

    try {
      setIsSubmittingOrder(true)
      setOrderError('')

      const payload = {
        tableNumber: selectedTable,
        customerName: customerName || user.name || 'Diner',
        items: cart.map((item) => ({
          menuItem: item._id,
          quantity: item.quantity,
        })),
      }

      const data = await placeOrder(payload, token)

      setPlacedOrder(data)
      setCart([])
      setSelectedTable(null)
      refreshTables()
    } catch (err) {
      setOrderError(err.message || 'Error occurred while placing order')
    } finally {
      setIsSubmittingOrder(false)
    }
  }

  return (
    <main className="main-content" id="home">
      <header className="hero-section">
        <h1 className="hero-title">Select Table &amp; Order Fresh</h1>
        <div className="hero-actions">
          <a href="#tables" className="btn-primary">Choose Table</a>
          <a href="#menu" className="btn-secondary">Browse Menu</a>
          {user && (
            <Link to="/my-orders" className="btn-secondary">
              View My Orders &rarr;
            </Link>
          )}
        </div>
      </header>

      <TableSelector
        tables={tables}
        selectedTable={selectedTable}
        onSelectTable={setSelectedTable}
        customerName={customerName}
        onCustomerNameChange={setCustomerName}
        loadingTables={loadingTables}
      />

      <section className="menu-section" id="menu">
        <h2 className="section-title">Our Menu</h2>

        <MenuSearch
          search={search}
          setSearch={setSearch}
          vegOnly={vegOnly}
          setVegOnly={setVegOnly}
        />

        <MenuFilter
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        {loadingMenu && (
          <div className="status-message loading-box">
            <p>⏳ Loading delicious menu items from database...</p>
          </div>
        )}

        {menuError && (
          <div className="status-message error-box">
            <p>⚠️ {menuError}</p>
            <button
              type="button"
              className="btn-retry"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {!loadingMenu && !menuError && displayedItems.length === 0 && (
          <div className="status-message empty-box">
            <p>No dishes found matching your current filters.</p>
          </div>
        )}

        {!loadingMenu && !menuError && displayedItems.length > 0 && (
          <div className="menu-grid">
            {displayedItems.map((item) => (
              <MenuItemCard
                key={item._id}
                item={item}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </section>

      <Cart
        cartItems={cart}
        onIncreaseQuantity={handleIncreaseQuantity}
        onDecreaseQuantity={handleDecreaseQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        selectedTable={selectedTable}
        isSubmitting={isSubmittingOrder}
        orderError={orderError}
        onPlaceOrder={handlePlaceOrder}
      />

      {placedOrder && (
        <OrderConfirmationModal
          order={placedOrder}
          onClose={() => setPlacedOrder(null)}
        />
      )}
    </main>
  )
}

export default HomePage
