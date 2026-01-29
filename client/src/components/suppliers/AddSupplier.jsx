import React, { useState } from "react";
import API from "../../api/api";
import { Building2, Mail, Phone, User, MapPin } from "lucide-react";
import toast from "react-hot-toast";

const AddSupplier = ({ onCancel, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/suppliers", form);
      toast.success("✅ Supplier added successfully!");
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to add supplier. Please try again.");
    }
  };

  return (
    <div className="p-8 bg-white rounded-2xl shadow-xl border border-gray-200 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
        <Building2 className="text-blue-600" size={28} /> Add New Supplier
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <Building2 className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            name="name"
            placeholder="Supplier Name"
            value={form.name}
            onChange={handleChange}
            className="border border-gray-300 pl-10 pr-4 py-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            required
          />
        </div>

        <div className="relative">
          <User className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            name="contact_person"
            placeholder="Contact Person"
            value={form.contact_person}
            onChange={handleChange}
            className="border border-gray-300 pl-10 pr-4 py-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <div className="relative">
          <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="border border-gray-300 pl-10 pr-4 py-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border border-gray-300 pl-10 pr-4 py-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
          <textarea
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            rows="3"
            className="border border-gray-300 pl-10 pr-4 py-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
          />
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="submit"
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-6 py-2.5 rounded-lg shadow-md hover:from-green-600 hover:to-emerald-700 transition-all"
          >
            + Add Supplier
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-2.5 rounded-lg transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSupplier;
