import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { Trash2, PlusCircle, Building2 } from "lucide-react";
import toast from "react-hot-toast";

const SupplierList = ({ onAdd }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/suppliers");
      setSuppliers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to fetch suppliers");
    } finally {
      setLoading(false);
    }
  };

  const deleteSupplier = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this supplier?");
    if (!confirmed) return;

    try {
      await API.delete(`/suppliers/${id}`);
      toast.success("🗑️ Supplier deleted successfully!");
      fetchSuppliers();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete supplier");
    }
  };

  return (
    <div className="p-8 bg-white rounded-2xl shadow-xl border border-gray-200 max-w-6xl mx-auto transition-all">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Building2 className="text-blue-600" size={26} />
          Supplier Management
        </h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
        >
          <PlusCircle size={18} /> Add Supplier
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-left">
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <tr>
              <th className="py-3 px-4 font-medium">ID</th>
              <th className="py-3 px-4 font-medium">Name</th>
              <th className="py-3 px-4 font-medium">Contact</th>
              <th className="py-3 px-4 font-medium">Email</th>
              <th className="py-3 px-4 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 italic"
                >
                  Loading suppliers...
                </td>
              </tr>
            ) : suppliers.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No suppliers found.
                </td>
              </tr>
            ) : (
              suppliers.map((s, i) => (
                <tr
                  key={s.supplier_id}
                  className={`border-b hover:bg-blue-50 transition ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="py-3 px-4 text-gray-700 font-medium">
                    {s.supplier_id}
                  </td>
                  <td className="py-3 px-4 text-gray-700">{s.name}</td>
                  <td className="py-3 px-4 text-gray-700">{s.phone || "—"}</td>
                  <td className="py-3 px-4 text-gray-700">{s.email || "—"}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => deleteSupplier(s.supplier_id)}
                      className="flex items-center gap-1 justify-center bg-red-500 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-red-600 transition-all shadow-sm hover:shadow-md"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierList;
