function MenuFilter({ categories, activeCategory, setActiveCategory }) {
  return (
    <div className="menu-tabs">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={`menu-tab ${activeCategory === category ? 'active' : ''}`}
          onClick={() => setActiveCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

export default MenuFilter
