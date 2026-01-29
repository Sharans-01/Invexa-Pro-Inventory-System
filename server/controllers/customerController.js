import db from "../db.js";

// ✅ Get all customers
export const getAllCustomers = (req, res) => {
  const q = "SELECT * FROM customers";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(data);
  });
};


export const getCustomerById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM customers WHERE customer_id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Customer not found" });
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ message: "Error fetching customer" });
  }
};

export const addCustomer = (req, res) => {
  const { name, email, phone, address } = req.body;
  const q = "INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)";

  db.query(q, [name, email, phone, address], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Failed to add customer" });
    }
    res.json({ message: "Customer added successfully", id: result.insertId });
  });
};

export const updateCustomer = (req, res) => {
  const { customer_id } = req.params;
  const { name, email, phone, address } = req.body;

  const sql = "UPDATE customers SET name=?, email=?, phone=?, address=? WHERE customer_id=?";
  db.query(sql, [name, email, phone, address, customer_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Error updating customer", error: err });
    res.json({ message: "Customer updated successfully" });
  });
};

export const deleteCustomer = (req, res) => {
  const { customer_id } = req.params;

  const sql = "DELETE FROM customers WHERE customer_id=?";
  db.query(sql, [customer_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Error deleting customer", error: err });
    res.json({ message: "Customer deleted successfully" });
  });
};

export const getCustomerCount = (req, res) => {
  const q = "SELECT COUNT(*) AS count FROM customers";
  db.query(q, (err, result) => {
    if (err) {
      console.error("❌ Error fetching customer count:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ count: result[0].count });
  });
};
