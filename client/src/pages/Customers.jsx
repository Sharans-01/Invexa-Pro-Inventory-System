import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  const headers = { Authorization: `Bearer ${token}` };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/customers", { headers });
      setCustomers(res.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/customers/${editingId}`, formData, { headers });
      } else {
        await axios.post("http://localhost:5000/api/customers", formData, { headers });
      }
      setFormData({ name: "", email: "", phone: "", address: "" });
      setEditingId(null);
      fetchCustomers();
    } catch (error) {
      console.error("Error saving customer:", error);
    }
  };

  const handleEdit = (customer) => {
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    });
    setEditingId(customer.customer_id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(`http://localhost:5000/api/customers/${id}`, { headers });
        fetchCustomers();
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Customer Management</h1>

      {/* Customer Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 border border-gray-100"
      >
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Customer Name"
          className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        {/* ✅ Add/Update Button (Green Gradient) */}
        <button
          type="submit"
          className="col-span-full flex justify-center items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
        >
          <PlusCircle size={18} />
          {editingId ? "Update Customer" : "Add Customer"}
        </button>
      </form>

      {/* Customer Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-100">
        <table className="min-w-full border-collapse">
          <thead className="bg-gradient-to-r from-indigo-600 to-blue-600">
            <tr>
              {["#", "Name", "Email", "Phone", "Address", "Actions"].map((head) => (
                <th
                  key={head}
                  className="p-3 text-left text-sm font-semibold text-white border-b border-gray-200"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {customers && customers.length > 0 ? (
              customers.map((customer, index) => (
                <tr
                  key={customer.customer_id}
                  className={`transition duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-blue-50/30"
                  } hover:bg-blue-100`}
                >
                  <td className="p-3 text-sm text-gray-700 font-medium">{index + 1}</td>
                  <td className="p-3 text-sm text-gray-800">{customer.name}</td>
                  <td className="p-3 text-sm text-gray-800">{customer.email}</td>
                  <td className="p-3 text-sm text-gray-800">{customer.phone}</td>
                  <td className="p-3 text-sm text-gray-800">{customer.address}</td>
                  <td className="p-3 flex justify-center gap-3">
  <button
    onClick={() => handleEdit(customer)}
    className="p-2 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all"
    title="Edit"
  >
    <Pencil size={18} />
  </button>
  <button
    onClick={() => handleDelete(customer.customer_id)}
    className="p-2 rounded-lg border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-all"
    title="Delete"
  >
    <Trash2 size={18} />
  </button>
</td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-6 text-sm">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
