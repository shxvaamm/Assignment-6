function TableSelector({
  tables,
  selectedTable,
  onSelectTable,
  customerName,
  onCustomerNameChange,
  loadingTables,
}) {
  return (
    <section className="table-selector-section" id="tables">
      <div className="table-selector-header">
        <h2 className="section-title">Select Your Dining Table</h2>
        <p className="section-subtitle">
          Choose an available table in the restaurant before placing your order
        </p>
      </div>

      <div className="customer-name-wrapper">
        <label htmlFor="customerNameInput" className="customer-name-label">
          Customer / Diner Name (Optional):
        </label>
        <input
          id="customerNameInput"
          type="text"
          className="customer-name-input"
          placeholder="e.g. Rahul Sharma / Guest Diner"
          value={customerName}
          onChange={(e) => onCustomerNameChange(e.target.value)}
        />
      </div>

      {loadingTables ? (
        <div className="status-message loading-box">
          <p>⏳ Loading restaurant tables...</p>
        </div>
      ) : (
        <div className="tables-grid">
          {tables.map((table) => {
            const isAvailable = table.status === 'Available'
            const isSelected = selectedTable === table.tableNumber

            return (
              <div
                key={table._id || table.tableNumber}
                className={`table-card ${
                  isSelected ? 'table-card-selected' : ''
                } ${!isAvailable ? 'table-card-disabled' : 'table-card-available'}`}
                onClick={() => {
                  if (isAvailable) {
                    onSelectTable(table.tableNumber)
                  }
                }}
                role="button"
                tabIndex={isAvailable ? 0 : -1}
                aria-disabled={!isAvailable}
              >
                <div className="table-card-top">
                  <span className="table-number-label">
                    Table {table.tableNumber}
                  </span>
                  <span
                    className={`table-status-pill ${
                      table.status === 'Available'
                        ? 'pill-available'
                        : table.status === 'Occupied'
                        ? 'pill-occupied'
                        : 'pill-reserved'
                    }`}
                  >
                    {table.status}
                  </span>
                </div>

                <div className="table-card-details">
                  <span className="table-capacity">👥 {table.capacity} Seats</span>
                </div>

                <div className="table-card-action">
                  {isSelected ? (
                    <span className="selected-indicator">✓ Selected</span>
                  ) : isAvailable ? (
                    <span className="select-prompt">Click to Select</span>
                  ) : (
                    <span className="unavailable-prompt">Unavailable</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="table-selection-banner">
        {selectedTable ? (
          <p className="banner-selected">
            ✅ You have selected <strong>Table #{selectedTable}</strong> for your order.
          </p>
        ) : (
          <p className="banner-pending">
            ⚠️ Please click on an <strong>Available</strong> table above to link your order.
          </p>
        )}
      </div>
    </section>
  )
}

export default TableSelector
