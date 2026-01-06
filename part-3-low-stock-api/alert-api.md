### Endpoint

`GET /api/companies/{company_id}/alerts/low-stock`

### Assumptions

* Each product has a predefined threshold value.
* Recent sales are defined as sales occurring in the last 30 days.
* Products without recent sales activity are ignored to prevent alert fatigue.
* Each product has at least one associated supplier.
* `days_until_stockout` is calculated using average daily sales.

### Tables Used

* `products(id, name, sku, threshold)`
* `warehouses(id, company_id, name)`
* `inventory(product_id, warehouse_id, quantity)`
* `sales(product_id, quantity, created_at)`
* `suppliers(id, name, contact_email)`
* `product_suppliers(product_id, supplier_id)`

### Implementation Approach

* Inventory data is fetched for all warehouses belonging to the given company.
* Only products where `current_stock < threshold` are considered.
* Recent sales (last 30 days) are checked to ensure the product is actively selling.
* Average daily sales are calculated to estimate `days_until_stockout`.
* Supplier details are fetched to support immediate reordering.

### Response

```json
{
  "alerts": [
    {
      "product_id": 123,
      "product_name": "Widget A",
      "sku": "WID-001",
      "warehouse_id": 456,
      "warehouse_name": "Main Warehouse",
      "current_stock": 5,
      "threshold": 20,
      "days_until_stockout": 12,
      "supplier": {
        "id": 789,
        "name": "Supplier Corp",
        "contact_email": "orders@supplier.com"
      }
    }
  ],
  "total_alerts": 1
}
