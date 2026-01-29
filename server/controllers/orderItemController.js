import db from "../db.js";

// ✅ Get all order items
export const getAllOrderItems = (req, res) => {
  const q = `
    SELECT oi.*, p.name AS product_name, o.order_id
    FROM order_items oi
    JOIN products p ON oi.product_id = p.product_id
    JOIN orders o ON oi.order_id = o.order_id
  `;
  db.query(q, (err, data) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(data);
  });
};

// ✅ Add order item
export const addOrderItem = (req, res) => {
  const { order_id, product_id, quantity, price } = req.body;
  const q = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)";
  db.query(q, [order_id, product_id, quantity, price], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to add order item" });
    res.json({ message: "Order item added successfully", order_item_id: result.insertId });
  });
};

// ✅ Update order item
export const updateOrderItem = (req, res) => {
  const { order_item_id } = req.params;
  const { quantity, price } = req.body;
  const q = "UPDATE order_items SET quantity = ?, price = ? WHERE order_item_id = ?";
  db.query(q, [quantity, price, order_item_id], (err) => {
    if (err) return res.status(500).json({ error: "Failed to update order item" });
    res.json({ message: "Order item updated successfully" });
  });
};

// ✅ Delete order item
export const deleteOrderItem = (req, res) => {
  const { order_item_id } = req.params;
  const q = "DELETE FROM order_items WHERE order_item_id = ?";
  db.query(q, [order_item_id], (err) => {
    if (err) return res.status(500).json({ error: "Failed to delete order item" });
    res.json({ message: "Order item deleted successfully" });
  });
};
