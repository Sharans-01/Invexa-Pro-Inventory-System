import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt, FaPlusCircle, FaBox } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import { Pencil, Trash2, PlusCircle } from "lucide-react";


const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    supplier_id: "",
  });
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");
  const api = axios.create({
    baseURL: "http://localhost:5000/api/products",
    headers: { Authorization: `Bearer ${token}` },
  });

  // ✅ Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await api.get("/");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to load products");
    }
  };

  // ✅ Fetch all suppliers
  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/suppliers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuppliers(res.data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      toast.error("Failed to load suppliers");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  // ✅ Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Add or Update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/${editingId}`, form);
        toast.success("Product updated successfully!");
      } else {
        await api.post("/", form);
        toast.success("Product added successfully!");
      }
      setForm({
        name: "",
        category: "",
        price: "",
        stock: "",
        supplier_id: "",
      });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      toast.error("Error saving product!");
    }
  };

  // ✅ Edit product
  const handleEdit = (product) => {
    setForm({
      name: product.product_name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      supplier_id: product.supplier_id || "",
    });
    setEditingId(product.product_id);
    toast("Editing product...", { icon: "✏️" });
  };

  // ✅ Delete product
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/${id}`);
        toast.success("Product deleted successfully!");
        fetchProducts();
      } catch (err) {
        console.error("Error deleting product:", err);
        toast.error("Error deleting product!");
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex items-center gap-3 mb-6">
        <FaBox className="text-indigo-600 text-4xl" />
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
          Product Management
        </h2>
      </div>

      {/* Add/Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-6 mb-8 grid md:grid-cols-6 gap-4 border border-gray-100"
      >
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <select
          name="supplier_id"
          value={form.supplier_id}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="">Select Supplier</option>
          {suppliers.map((s) => (
            <option key={s.supplier_id} value={s.supplier_id}>
              {s.name}
            </option>
          ))}
        </select>

       <button
  type="submit"
  className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg px-4 py-2 hover:from-green-600 hover:to-emerald-700 transition-all"
>
          <FaPlusCircle />
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* Product Table */}
      <div className="overflow-x-auto bg-white/90 backdrop-blur-md shadow-lg rounded-2xl border border-gray-100">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
            <tr>
              <th className="py-3 px-5 text-sm font-semibold">ID</th>
              <th className="py-3 px-5 text-sm font-semibold">Name</th>
              <th className="py-3 px-5 text-sm font-semibold">Category</th>
              <th className="py-3 px-5 text-sm font-semibold">Price (₹)</th>
              <th className="py-3 px-5 text-sm font-semibold">Stock</th>
              <th className="py-3 px-5 text-sm font-semibold">Supplier</th>
              <th className="py-3 px-5 text-center text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
         <tbody>
  {products.length > 0 ? (
    products.map((p, index) => {
      const stockLevelClass =
        p.stock <= 5
          ? "text-red-600 font-semibold" // 🔴 Low stock
          : p.stock >= 20
          ? "text-green-600 font-semibold" // 🟢 High stock
          : "text-yellow-600 font-semibold"; // 🟡 Medium stock

      return (
        <tr
          key={p.product_id}
          className={`transition ${
            index % 2 === 0 ? "bg-gray-50" : "bg-white"
          } hover:bg-indigo-50`}
        >
          <td className="py-3 px-5 text-gray-700 font-medium">{p.product_id}</td>
          <td className="py-3 px-5 text-gray-700">{p.product_name}</td>
          <td className="py-3 px-5 text-gray-700">{p.category}</td>
          <td className="py-3 px-5 text-gray-700">{p.price}</td>
          <td className={`py-3 px-5 ${stockLevelClass}`}>{p.stock}</td>
          <td className="py-3 px-5 text-gray-700">
            {p.supplier_name || "-"}
          </td>
         <td className="py-3 px-5 text-center flex justify-center gap-3">
  <button
    onClick={() => handleEdit(p)}
    className="p-2 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all"
    title="Edit"
  >
    <Pencil size={18} />
  </button>
  <button
    onClick={() => handleDelete(p.product_id)}
    className="p-2 rounded-lg border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-all"
    title="Delete"
  >
    <Trash2 size={18} />
  </button>
</td>

        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="7" className="text-center text-gray-500 py-6 font-medium">
        No products found.
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default ProductTable;
