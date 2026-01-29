import db from "../db.js";

// ✅ Get all orders with customer and product names
export const getAllOrders = (req, res) => {
  const q = `
    SELECT 
      o.order_id,
      c.name AS customer_name,
      o.total_amount,
      o.order_date,
      o.status,
      GROUP_CONCAT(p.name SEPARATOR ', ') AS products
    FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    GROUP BY o.order_id
    ORDER BY o.order_id DESC
  `;

  db.query(q, (err, data) => {
    if (err) {
      console.error("❌ Error fetching orders:", err);
      return res.status(500).json({ error: "Database error while fetching orders" });
    }
    res.json(data);
  });
};

// ✅ Get single order with item details
export const getOrderById = (req, res) => {
  const { id } = req.params;

  const orderQuery = `
    SELECT o.*, c.name AS customer_name
    FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id
    WHERE o.order_id = ?
  `;

  const itemsQuery = `
    SELECT oi.*, p.name AS product_name
    FROM order_items oi
    JOIN products p ON oi.product_id = p.product_id
    WHERE oi.order_id = ?
  `;

  db.query(orderQuery, [id], (err, orderResult) => {
    if (err) {
      console.error("❌ Error fetching order:", err);
      return res.status(500).json({ error: "Error fetching order" });
    }
    if (orderResult.length === 0)
      return res.status(404).json({ error: "Order not found" });

    db.query(itemsQuery, [id], (err2, itemResult) => {
      if (err2) {
        console.error("❌ Error fetching order items:", err2);
        return res.status(500).json({ error: "Error fetching order items" });
      }
      res.json({ ...orderResult[0], items: itemResult });
    });
  });
};

// ✅ Add new order
export const addOrder = (req, res) => {
  const { customer_id, order_date, total_amount, items } = req.body;

  const orderQuery =
    "INSERT INTO orders (customer_id, order_date, total_amount) VALUES (?, ?, ?)";
  db.query(orderQuery, [customer_id, order_date, total_amount], (err, orderResult) => {
    if (err) {
      console.error("❌ Error inserting order:", err);
      return res.status(500).json({ message: "Failed to create order" });
    }

    const orderId = orderResult.insertId;
    const itemQuery =
      "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?";
    const itemValues = items.map((item) => [
      orderId,
      item.product_id,
      item.quantity,
      item.price,
    ]);

    db.query(itemQuery, [itemValues], (err2) => {
      if (err2) {
        console.error("❌ Error inserting order items:", err2);
        return res.status(500).json({ message: "Failed to add order items" });
      }

      res.json({ message: "✅ Order created successfully", orderId });
    });
  });
};

// ✅ Update order with new items
export const updateOrder = (req, res) => {
  const { id } = req.params;
  const { customer_id, order_date, total_amount, items, status } = req.body;

  if (!customer_id || !order_date || !total_amount) {
    return res.status(400).json({ error: "Missing required order fields" });
  }

  const orderQuery = `
    UPDATE orders 
    SET customer_id = ?, order_date = ?, total_amount = ?, status = ? 
    WHERE order_id = ?
  `;

  db.query(
    orderQuery,
    [customer_id, order_date, total_amount, status || "Pending", id],
    (err) => {
      if (err) {
        console.error("❌ Error updating order:", err.sqlMessage);
        return res.status(500).json({ error: "Failed to update order" });
      }

      const deleteItemsQuery = "DELETE FROM order_items WHERE order_id = ?";
      db.query(deleteItemsQuery, [id], (err2) => {
        if (err2) {
          console.error("❌ Error deleting old order items:", err2.sqlMessage);
          return res.status(500).json({ error: "Failed to refresh order items" });
        }

        if (Array.isArray(items) && items.length > 0) {
          const values = items.map((item) => [
            id,
            item.product_id,
            item.quantity,
            item.price,
          ]);

          const insertItemsQuery =
            "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?";
          db.query(insertItemsQuery, [values], (err3) => {
            if (err3) {
              console.error("❌ Error inserting new order items:", err3.sqlMessage);
              return res.status(500).json({ error: "Failed to update order items" });
            }
            res.json({ message: "✅ Order and items updated successfully" });
          });
        } else {
          res.json({ message: "✅ Order updated (no items provided)" });
        }
      });
    }
  );
};

// ✅ Delete order
export const deleteOrder = (req, res) => {
  const { order_id } = req.params;
  const q = "DELETE FROM orders WHERE order_id = ?";

  db.query(q, [order_id], (err) => {
    if (err) {
      console.error("❌ Error deleting order:", err);
      return res.status(500).json({ error: "Failed to delete order" });
    }
    res.json({ message: "🗑️ Order deleted successfully" });
  });
};

// ✅ Get order count
export const getOrderCount = (req, res) => {
  const q = "SELECT COUNT(*) AS count FROM orders";
  db.query(q, (err, result) => {
    if (err) {
      console.error("❌ Error fetching order count:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ count: result[0].count });
  });
};
