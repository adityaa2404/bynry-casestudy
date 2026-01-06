StockFlow – Backend Case Study
Backend Engineering Intern | Bynry


Case Study Document Link : https://surl.li/zrtify
This repository contains my solution to the backend case study for the Backend Engineering Intern role at Bynry.
The focus is on code quality, data modeling, and API design for a B2B inventory management system.

Repository Structure
.
├── part-1-code-review/
├── part-2-database-design/
├── part-3-low-stock-api/
└── README.md



Part 1: Code Review & Debugging

  Reviewed a faulty API endpoint and identified technical and business logic issues related to:

  Data consistency
  Transactions
  REST best practices
  Business rule violations

Part 2: Database Design

  Designed a normalized schema supporting:
  Multiple companies and warehouses
  Inventory tracking and history
  Supplier relationships
  Product bundles

Includes schema definition, ER diagram, and design justifications.

Part 3: Low-Stock Alerts API

  Implemented an API endpoint to return low-stock alerts for a company.

Endpoint : GET /api/companies/{company_id}/alerts/low-stock


  Key Features

   Threshold-based alerts
   Recent sales filtering
   Multi-warehouse support
   Supplier details for reordering

