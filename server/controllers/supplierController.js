import db from "../db.js";

// ✅ Get all suppliers
export const getAllSuppliers = async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM suppliers ORDER BY supplier_id DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};


// ✅ Get single supplier
export const getSupplierById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM suppliers WHERE supplier_id = ?", [id], (err, data) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (data.length === 0) return res.status(404).json({ error: "Supplier not found" });
    res.json(data[0]);
  });
};

// ✅ Add supplier
export const addSupplier = (req, res) => {
  const { name, contact_person, phone, email, address } = req.body;
  const q =
    "INSERT INTO suppliers (name, contact_person, phone, email, address) VALUES (?, ?, ?, ?, ?)";
  db.query(q, [name, contact_person, phone, email, address], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to add supplier" });
    res.json({ message: "Supplier added successfully", supplier_id: result.insertId });
  });
};

// ✅ Update supplier
export const updateSupplier = (req, res) => {
  const { id } = req.params;
  const { name, contact_person, phone, email, address } = req.body;
  const q =
    "UPDATE suppliers SET name=?, contact_person=?, phone=?, email=?, address=? WHERE supplier_id=?";
  db.query(q, [name, contact_person, phone, email, address, id], (err) => {
    if (err) return res.status(500).json({ error: "Failed to update supplier" });
    res.json({ message: "Supplier updated successfully" });
  });
};

// ✅ Delete supplier
export const deleteSupplier = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM suppliers WHERE supplier_id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: "Failed to delete supplier" });
    res.json({ message: "Supplier deleted successfully" });
  });
};


// ✅ Get supplier count
export const getSupplierCount = (req, res) => {
  const q = "SELECT COUNT(*) AS count FROM suppliers";
  db.query(q, (err, result) => {
    if (err) {
      console.error("❌ Error fetching supplier count:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ count: result[0].count });
  });
};