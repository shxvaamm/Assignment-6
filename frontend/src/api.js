export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002'

export const getAuthHeaders = (token) => {
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

export const loginUser = async ({ email, password }) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Login failed')
  }
  return data
}

export const registerUser = async ({ name, email, password }) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Registration failed')
  }
  return data
}

export const getProfile = async (token) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: getAuthHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch user profile')
  }
  return data
}

export const getMenuItems = async (category) => {
  const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : ''
  const res = await fetch(`${API_BASE_URL}/api/menu${query}`)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch menu items')
  }
  return data
}

export const getMenuItemById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/api/menu/${id}`)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch menu item')
  }
  return data
}

export const createMenuItem = async (itemData, token) => {
  const res = await fetch(`${API_BASE_URL}/api/menu`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(itemData),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Failed to create menu item')
  }
  return data
}

export const updateMenuItem = async (id, itemData, token) => {
  const res = await fetch(`${API_BASE_URL}/api/menu/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(itemData),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update menu item')
  }
  return data
}

export const toggleMenuItemAvailability = async (id, token) => {
  const res = await fetch(`${API_BASE_URL}/api/menu/${id}/toggle`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Failed to toggle availability')
  }
  return data
}

export const deleteMenuItem = async (id, token) => {
  const res = await fetch(`${API_BASE_URL}/api/menu/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete menu item')
  }
  return data
}

export const getTables = async () => {
  const res = await fetch(`${API_BASE_URL}/api/tables`)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch tables')
  }
  return data
}

export const getTableById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/api/tables/${id}`)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch table')
  }
  return data
}

export const createTable = async (tableData, token) => {
  const res = await fetch(`${API_BASE_URL}/api/tables`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(tableData),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Failed to create table')
  }
  return data
}

export const updateTable = async (id, tableData, token) => {
  const res = await fetch(`${API_BASE_URL}/api/tables/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(tableData),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update table')
  }
  return data
}

export const deleteTable = async (id, token) => {
  const res = await fetch(`${API_BASE_URL}/api/tables/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete table')
  }
  return data
}

export const placeOrder = async (orderData, token) => {
  const res = await fetch(`${API_BASE_URL}/api/orders`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(orderData),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Failed to place order')
  }
  return data
}

export const getMyOrders = async (token) => {
  const res = await fetch(`${API_BASE_URL}/api/orders/my-orders`, {
    headers: getAuthHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch customer orders')
  }
  return data
}

export const getAllOrders = async (token, filters = {}) => {
  const params = new URLSearchParams()
  if (filters.status && filters.status !== 'All') {
    params.append('status', filters.status)
  }
  if (filters.tableNumber) {
    params.append('tableNumber', filters.tableNumber)
  }

  const queryString = params.toString() ? `?${params.toString()}` : ''
  const res = await fetch(`${API_BASE_URL}/api/orders${queryString}`, {
    headers: getAuthHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch all orders')
  }
  return data
}

export const getOrderById = async (orderId, token) => {
  const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
    headers: getAuthHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch order details')
  }
  return data
}

export const cancelOrder = async (orderId, token) => {
  const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/cancel`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Failed to cancel order')
  }
  return data
}

export const updateOrderStatus = async (orderId, status, token) => {
  const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ status }),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update order status')
  }
  return data
}

export const getDashboardStats = async (token) => {
  const res = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
    headers: getAuthHeaders(token),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch dashboard statistics')
  }
  return data
}
