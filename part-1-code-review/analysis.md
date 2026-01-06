## Part 1: Code Review & Debugging

Below are the key technical and business-logic issues identified in the provided API implementation.

### Issue 1: Missing HTTP Status Codes
* **Observation:** The API always returns a default `200 OK` status.
* **Impact:**
    * API consumers cannot distinguish between success and failure.
    * Violates REST best practices.

### Issue 2: No Error Handling
* **Observation:** Any database exception causes the request to crash.
* **Impact:**
    * Results in unhandled exceptions.
    * Leads to poor observability and difficult debugging.

### Issue 3: SKU Uniqueness Not Enforced
* **Observation:** There is no check to ensure `sku` is unique across the platform.
* **Impact (Production):**
    * Duplicate SKUs can exist in the system.
    * Causes ambiguity in orders, billing, and inventory tracking.

### Issue 4: Product Incorrectly Tied to a Single Warehouse
* **Observation:** The product is created with a specific `warehouse_id` (e.g., `warehouse_id=data['warehouse_id']`).
* **Impact:**
    * Violates the business requirement: *"Products can exist in multiple warehouses."*
    * Limits inventory distribution flexibility.

### Issue 5: No Database Transaction / Atomicity
* **Observation:** The code executes two separate `commit()` calls (one for product, one for inventory).
* **Impact:**
    * Risk of **data inconsistency** in production.
    * If the product commit succeeds but the inventory commit fails, the system is left with a product that exists but has no inventory record (orphaned data).

### Issue 6: No Input Validation / Optional Fields
* **Observation:** Fields are accessed directly (e.g., `data['name']`, `data['sku']`).
* **Impact:**
    * Missing fields raise a `KeyError`, resulting in a `500 Internal Server Error`.
    * Provides a poor client experience due to lack of descriptive error messages.
