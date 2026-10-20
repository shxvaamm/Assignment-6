import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MyOrdersPage from './pages/MyOrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import AdminOrdersPage from './pages/AdminOrdersPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminMenuPage from './pages/AdminMenuPage'
import AdminMenuNewPage from './pages/AdminMenuNewPage'
import AdminMenuEditPage from './pages/AdminMenuEditPage'
import AdminTablesPage from './pages/AdminTablesPage'
import './App.css'

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('restaurant_user')
    if (!savedUser) return null
    try {
      return JSON.parse(savedUser)
    } catch {
      return null
    }
  })

  const [token, setToken] = useState(() => {
    return localStorage.getItem('restaurant_token') || null
  })

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('restaurant_cart')
    if (!savedCart) return []
    try {
      return JSON.parse(savedCart)
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('restaurant_cart', JSON.stringify(cart))
  }, [cart])

  const handleLogin = (loggedInUser, userToken) => {
    setUser(loggedInUser)
    setToken(userToken)
    localStorage.setItem('restaurant_user', JSON.stringify(loggedInUser))
    localStorage.setItem('restaurant_token', userToken)
  }

  const handleLogout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('restaurant_user')
    localStorage.removeItem('restaurant_token')
  }

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="app-container">
      <Navbar
        user={user}
        onLogout={handleLogout}
        totalCartCount={totalCartCount}
      />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              user={user}
              token={token}
              cart={cart}
              setCart={setCart}
            />
          }
        />
        <Route
          path="/login"
          element={<LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/register"
          element={<RegisterPage onLogin={handleLogin} />}
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute user={user}>
              <MyOrdersPage token={token} user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute user={user}>
              <OrderDetailPage token={token} user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute user={user} allowedRoles={['staff', 'admin']}>
              <AdminOrdersPage token={token} user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute user={user} allowedRoles={['staff', 'admin']}>
              <AdminDashboardPage token={token} user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute user={user} allowedRoles={['admin']}>
              <AdminMenuPage token={token} user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/menu/new"
          element={
            <ProtectedRoute user={user} allowedRoles={['admin']}>
              <AdminMenuNewPage token={token} user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/menu/:id/edit"
          element={
            <ProtectedRoute user={user} allowedRoles={['admin']}>
              <AdminMenuEditPage token={token} user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/tables"
          element={
            <ProtectedRoute user={user} allowedRoles={['admin']}>
              <AdminTablesPage token={token} user={user} />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <footer className="footer">
        <p><strong>PS06: Restaurant Menu &amp; Table Order System</strong></p>
        <p>College Assignment &bull; Full Stack Ordering &amp; Management System</p>
      </footer>
    </div>
  )
}

export default App
