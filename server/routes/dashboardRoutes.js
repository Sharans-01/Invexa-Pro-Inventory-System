import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/category-distribution", (req, res) => {
  const q = `
    SELECT category, COUNT(*) AS count
    FROM products
    GROUP BY category
  `;

  db.query(q, (err, data) => {
    if (err) {
      console.error("❌ SQL Error:", err); // 👈 Add this
      return res.status(500).json({ message: "Error fetching category distribution" });
    }
    res.json(data);
  });
});

// dashboardRoutes.js
router.get("/stock-distribution", (req, res) => {
  const q = `
    SELECT name, stock
    FROM products
  `;
  db.query(q, (err, data) => {
    if (err) {
      console.error("Error fetching stock distribution:", err);
      return res.status(500).json({ message: "Error fetching stock distribution" });
    }
    res.json(data);
  });
});


export default router;
