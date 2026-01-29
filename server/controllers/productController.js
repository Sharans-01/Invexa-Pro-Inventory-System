import db from "../db.js";

// ✅ Get all products
export const getAllProducts = (req, res) => {
  const q = `
    SELECT 
      p.product_id,
      p.name AS product_name,
      p.category,
      p.price,
      p.stock,
      p.supplier_id,
      s.name AS supplier_name
    FROM products p
    LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
    ORDER BY p.product_id DESC
  `;

  db.query(q, (err, data) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(data);
  });
};



// ✅ Get single product by ID
export const getProductById = (req, res) => {
  const q = "SELECT * FROM products WHERE product_id = ?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (data.length === 0)
      return res.status(404).json({ error: "Product not found" });
    res.json(data[0]);
  });
};

// ✅ Add new product
export const addProduct = (req, res) => {
  const { name, category, price, stock, supplier_id } = req.body; // ✅ include supplier_id

  const q =
    "INSERT INTO products (name, category, price, stock, supplier_id) VALUES (?, ?, ?, ?, ?)";

  db.query(q, [name, category, price, stock, supplier_id], (err, result) => {
    if (err) {
      console.error("Error inserting product:", err);
      return res.status(500).json({ error: "Failed to add product" });
    }

    res.json({
      message: "Product added successfully",
      product_id: result.insertId,
    });
  });
};


// ✅ Update product
export const updateProduct = (req, res) => {
  const { name, category, price, stock } = req.body;
  const q =
    "UPDATE products SET name=?, category=?, price=?, stock=? WHERE product_id=?";
  db.query(q, [name, category, price, stock, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: "Failed to update product" });
    res.json({ message: "Product updated successfully" });
  });
};

// ✅ Delete product
export const deleteProduct = (req, res) => {
  const q = "DELETE FROM products WHERE product_id=?";
  db.query(q, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: "Failed to delete product" });
    res.json({ message: "Product deleted successfully" });
  });
};

// ✅ Get product count (no mysql2/promise needed)
export const getProductCount = (req, res) => {
  const q = "SELECT COUNT(*) AS count FROM products";

  db.query(q, (err, result) => {
    if (err) {
      console.error("Error fetching product count:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ count: result[0].count });
  });
};

export const getLowStockProducts = (req, res) => {
  const q = `
    SELECT product_id, name, category, stock
    FROM products
    WHERE stock <= 10
    ORDER BY stock ASC
  `;

  db.query(q, (err, data) => {
    if (err) {
      console.error("Error fetching low stock products:", err);
      return res.status(500).json({ message: "Error fetching low stock products" });
    }
    res.json(data);
  });
};






