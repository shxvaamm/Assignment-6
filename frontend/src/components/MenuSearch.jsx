function MenuSearch({ search, setSearch, vegOnly, setVegOnly }) {
  return (
    <div className="search-filter-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Search dishes by name or description..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <label className="veg-only-label">
        <input
          type="checkbox"
          checked={vegOnly}
          onChange={(e) => setVegOnly(e.target.checked)}
        />
        <span>🌱 Veg Only</span>
      </label>
    </div>
  )
}

export default MenuSearch
