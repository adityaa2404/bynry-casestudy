const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/api/companies/:companyId/alerts/low-stock", async (req, res) => {
  const { companyId } = req.params;

  try {
    /*
      Fetch low-stock inventory across all warehouses
      for the given company.
    */
    const inventoryRows = await db.query(`
      SELECT
        p.id AS product_id,
        p.name AS product_name,
        p.sku,
        p.threshold,
        w.id AS warehouse_id,
        w.name AS warehouse_name,
        i.quantity
      FROM inventory i
      JOIN products p ON p.id = i.product_id
      JOIN warehouses w ON w.id = i.warehouse_id
      WHERE w.company_id = ?
        AND i.quantity < p.threshold
    `, [companyId]);

    const alerts = [];

    for (const row of inventoryRows) {

      // Sales in last 30 days
      const salesRows = await db.query(`
        SELECT quantity
        FROM sales
        WHERE product_id = ?
          AND created_at >= NOW() - INTERVAL 30 DAY
      `, [row.product_id]);

      // Skip products with no recent sales
      if (salesRows.length === 0) continue;
        
      // Calculate average daily sales
      const totalSales = salesRows.reduce(
        (sum, s) => sum + s.quantity, 0
      );

      const days_until_stockout = Math.floor(
        row.quantity / (totalSales / 30)
      );

      // Supplier info
      const [supplier] = await db.query(`
        SELECT s.id, s.name, s.contact_email
        FROM suppliers s
        JOIN product_suppliers ps ON ps.supplier_id = s.id
        WHERE ps.product_id = ?
        LIMIT 1
      `, [row.product_id]);

      alerts.push({
        product_id: row.product_id,
        product_name: row.product_name,
        sku: row.sku,
        warehouse_id: row.warehouse_id,
        warehouse_name: row.warehouse_name,
        current_stock: row.quantity,
        threshold: row.threshold,
        days_until_stockout,
        supplier
      });
    }

    return res.json({
      alerts,
      total_alerts: alerts.length
    });

  } catch (err) {
    console.error("Low stock alert error:", err);
    //for unexpected failures,handling returns 500 Internal Server Error 
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
