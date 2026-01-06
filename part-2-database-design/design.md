## Part 2: Database Design

### 1. Database Schema
```sql
-- Companies Table
CREATE TABLE companies (
  id          integer PRIMARY KEY,
  name        varchar NOT NULL,
  location    varchar
);

-- Warehouses Table
CREATE TABLE warehouses (
  id          integer PRIMARY KEY,
  company_id  integer NOT NULL,
  name        varchar NOT NULL,
  location    varchar,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Products Table
CREATE TABLE products (
  id          integer PRIMARY KEY,
  name        varchar NOT NULL,
  sku         varchar NOT NULL UNIQUE,
  price       decimal
);

-- Inventory Table
CREATE TABLE inventory (
  id          integer PRIMARY KEY,
  product_id  integer NOT NULL,
  warehouse_id integer NOT NULL,
  quantity    integer NOT NULL DEFAULT 0,
  updated_at  timestamp NOT NULL,
  UNIQUE (product_id, warehouse_id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
);

-- Inventory History Table
CREATE TABLE inventory_history (
  id            integer PRIMARY KEY,
  product_id    integer NOT NULL,
  warehouse_id  integer NOT NULL,
  change_amount integer NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
);

-- Suppliers Table
CREATE TABLE suppliers (
  id            integer PRIMARY KEY,
  name          varchar NOT NULL,
  contact_email varchar,
  location      varchar
);

-- Product Suppliers Junction Table
CREATE TABLE product_suppliers (
  product_id   integer NOT NULL,
  supplier_id  integer NOT NULL,
  PRIMARY KEY (product_id, supplier_id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- Product Bundles Table
CREATE TABLE product_bundles (
  bundle_product_id integer NOT NULL,
  child_product_id  integer NOT NULL,
  quantity          integer NOT NULL,
  PRIMARY KEY (bundle_product_id, child_product_id),
  FOREIGN KEY (bundle_product_id) REFERENCES products(id),
  FOREIGN KEY (child_product_id) REFERENCES products(id)
);
```

### 2. Missing Requirements / Questions for Product Team
Does a supplier supply only to a single company or multiple companies?

Is product pricing global or does it vary per warehouse?

Is SKU uniqueness global across the platform or per company?

### 3. Design Choices
- Primary Keys All tables use primary keys to uniquely identify records and support efficient joins.

- Foreign Key Constraints : Used to enforce referential integrity between related entities such as companies, warehouses, products, and inventory.

- Unique Constraint on products.sku : Ensures each product is uniquely identifiable across the platform and prevents duplicate SKUs.

- Composite Unique Constraint on Inventory UNIQUE (product_id, warehouse_id) Prevents duplicate inventory entries for the same product in a warehouse.

- Many-to-Many Junction Tables : product_suppliers and product_bundles use composite primary keys to avoid duplicate relationships.
,Separation of Inventory & Inventory History ,Keeps current stock queries fast while allowing detailed audit tracking of inventory changes.
