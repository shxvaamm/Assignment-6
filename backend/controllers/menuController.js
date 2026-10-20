import mongoose from 'mongoose'
import MenuItem from '../models/MenuItem.js'

export const getMenuItems = async (req, res) => {
  try {
    const { category } = req.query
    const filter = category && category !== 'All' ? { category } : {}
    const items = await MenuItem.find(filter).sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch menu items', error: err.message })
  }
}

export const getMenuItemById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid menu item ID format' })
    }

    const item = await MenuItem.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' })
    }
    res.json(item)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch item', error: err.message })
  }
}

export const createMenuItem = async (req, res) => {
  try {
    const { name, description, category, price, foodType, isAvailable, imageUrl } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Menu item name is required' })
    }

    if (!category) {
      return res.status(400).json({ message: 'Category is required' })
    }

    const validCategories = ['Starters', 'Main Course', 'Beverages', 'Desserts']
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: `Category must be one of: ${validCategories.join(', ')}` })
    }

    if (price === undefined || price === null || price === '') {
      return res.status(400).json({ message: 'Price is required' })
    }

    if (isNaN(Number(price)) || Number(price) < 0) {
      return res.status(400).json({ message: 'Price must be a valid positive number' })
    }

    const newItem = new MenuItem({
      name: name.trim(),
      description: (description && description.trim()) || '',
      category,
      price: Number(price),
      foodType: foodType || 'Veg',
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
      imageUrl: (imageUrl && imageUrl.trim()) || '',
    })

    const savedItem = await newItem.save()
    res.status(201).json(savedItem)
  } catch (err) {
    res.status(400).json({ message: 'Failed to create menu item', error: err.message })
  }
}

export const updateMenuItem = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid menu item ID format' })
    }

    const { name, description, category, price, foodType, isAvailable, imageUrl } = req.body

    const item = await MenuItem.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' })
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ message: 'Menu item name cannot be empty' })
      }
      item.name = name.trim()
    }

    if (category !== undefined) {
      const validCategories = ['Starters', 'Main Course', 'Beverages', 'Desserts']
      if (!validCategories.includes(category)) {
        return res.status(400).json({ message: `Category must be one of: ${validCategories.join(', ')}` })
      }
      item.category = category
    }

    if (price !== undefined) {
      if (isNaN(Number(price)) || Number(price) < 0) {
        return res.status(400).json({ message: 'Price must be a valid positive number' })
      }
      item.price = Number(price)
    }

    if (foodType !== undefined) {
      item.foodType = foodType
    }

    if (isAvailable !== undefined) {
      item.isAvailable = Boolean(isAvailable)
    }

    if (description !== undefined) {
      item.description = description.trim()
    }

    if (imageUrl !== undefined) {
      item.imageUrl = imageUrl.trim()
    }

    const updatedItem = await item.save()
    res.json(updatedItem)
  } catch (err) {
    res.status(400).json({ message: 'Failed to update menu item', error: err.message })
  }
}

export const toggleMenuItemAvailability = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid menu item ID format' })
    }

    const item = await MenuItem.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' })
    }

    item.isAvailable = !item.isAvailable
    const updatedItem = await item.save()
    res.json(updatedItem)
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle item availability', error: err.message })
  }
}

export const deleteMenuItem = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid menu item ID format' })
    }

    const item = await MenuItem.findByIdAndDelete(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' })
    }

    res.json({ message: 'Menu item deleted successfully', id: req.params.id })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete menu item', error: err.message })
  }
}
