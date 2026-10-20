import { Navigate, useLocation, Link } from 'react-router-dom'

function ProtectedRoute({ user, allowedRoles, children }) {
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="orders-page-container" style={{ textAlign: 'center', marginTop: '3rem' }}>
        <div className="status-message error-box" style={{ padding: '2rem' }}>
          <h2>⛔ Access Denied (403 Forbidden)</h2>
          <p style={{ margin: '1rem 0' }}>
            You are logged in as <strong>{user.role}</strong> ({user.name}), but this page requires{' '}
            <strong>{allowedRoles.join(' or ')}</strong> privileges.
          </p>
          <Link to="/" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
            Return to Restaurant Home
          </Link>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
