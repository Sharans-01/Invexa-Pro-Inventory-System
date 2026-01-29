import express from "express";
import db from "../db.js";
import verifyToken from "../middleware/authMiddleware.js";
import {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductCount,
  getLowStockProducts
} from "../controllers/productController.js";

const router = express.Router();

// ✅ Product count (keep before :id)
router.get("/count", async (req, res) => {
  try {
    const [result] = await db.query("SELECT COUNT(*) AS count FROM products");
    res.json({ count: result[0].count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ Fetch all suppliers (for dropdown in frontend)
router.get("/suppliers", verifyToken, (req, res) => {
  const query = "SELECT supplier_id, supplier_name FROM suppliers";
  db.query(query, (err, data) => {
    if (err) {
      console.error("Error fetching suppliers:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(data);
  });
});

router.get("/recent", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products ORDER BY created_at DESC LIMIT 5");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching recent products" });
  }
});


// ✅ Product CRUD Routes
router.get("/",  getAllProducts);
router.get("/count/all", getProductCount);
router.get("/low-stock", getLowStockProducts);
router.get("/:id",  getProductById);
router.post("/", addProduct);
router.put("/:id", updateProduct);
router.delete("/:id",  deleteProduct);



export default router;
