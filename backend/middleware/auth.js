import jwt from 'jsonwebtoken'

export const authenticateUser = (req, res, next) => {
  const authHeader = req.header('Authorization')
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No authentication token provided.' })
  }

  try {
    const secret = process.env.JWT_SECRET || 'restaurant_jwt_secret_2026_xyz'
    const decoded = jwt.verify(token, secret)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired authentication token.', error: err.message })
  }
}

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden. You do not have permission to access this resource.' })
    }
    next()
  }
}
