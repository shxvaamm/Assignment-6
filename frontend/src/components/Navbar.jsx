import { Link, useNavigate } from 'react-router-dom'

function Navbar({ user, onLogout, totalCartCount }) {
  const navigate = useNavigate()

  const handleLogoutClick = () => {
    onLogout()
    navigate('/login')
  }

  const isAdmin = user && user.role === 'admin'
  const isStaff = user && (user.role === 'staff' || user.role === 'admin')

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" className="brand-link">
          <span className="brand-icon">🍽️</span>
          <div>
            <span className="brand-title">Campus Bites</span>
          </div>
        </Link>
      </div>

      <ul className="nav-links">
        <li><Link to="/">Home &amp; Menu</Link></li>
        {isStaff && (
          <>
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/orders">Manage Orders</Link></li>
          </>
        )}
        {isAdmin && (
          <>
            <li><Link to="/admin/menu">Manage Menu</Link></li>
            <li><Link to="/admin/tables">Manage Tables</Link></li>
          </>
        )}
        {user && (
          <li><Link to="/my-orders">My Orders</Link></li>
        )}
        <li>
          <a href="/#cart">
            Cart {totalCartCount > 0 ? `(${totalCartCount})` : ''}
          </a>
        </li>
      </ul>

      <div className="nav-auth">
        {user ? (
          <div className="user-nav-profile">
            <span className="user-badge">
              👤 {user.name} <small className={`role-tag role-${user.role}`}>({user.role})</small>
            </span>
            <button
              type="button"
              className="btn-logout"
              onClick={handleLogoutClick}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/register" className="btn-register">Register</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
