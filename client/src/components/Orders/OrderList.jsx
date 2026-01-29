import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { Trash2, Edit3, ClipboardList } from "lucide-react";

const OrderList = ({ onAdd, onEdit }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await API.delete(`/orders/${id}`);
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-white to-blue-50 rounded-2xl shadow-xl border border-gray-200 backdrop-blur-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ClipboardList className="text-blue-600" size={28} />
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
            Orders Overview
          </h2>
        </div>
        <button
          onClick={onAdd}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-md transition-transform transform hover:scale-105"
        >
          + Add Order
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-xl overflow-hidden shadow-sm backdrop-blur-lg">
          <thead className="bg-gradient-to-r from-blue-100 to-indigo-100 text-gray-800">
            <tr>
              <th className="p-3 text-left font-semibold">Order ID</th>
              <th className="p-3 text-left font-semibold">Customer</th>
              <th className="p-3 text-left font-semibold">Product</th>
              <th className="p-3 text-left font-semibold">Total Amount</th>
              <th className="p-3 text-left font-semibold">Date</th>
              <th className="p-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
      <td
        colSpan="6"
        className="text-center p-6 text-gray-500 italic bg-gray-50"
      >
        No orders found.
      </td>
    </tr>
  ) : (
    orders.map((order, index) => (
      <tr
        key={order.order_id}
        className={`transition duration-300 ease-in-out hover:scale-[1.01] hover:shadow-md ${
          index % 2 === 0 ? "bg-white" : "bg-blue-50"
        }`}
      >
        <td className="p-3 font-medium text-gray-700">
          #{order.order_id}
        </td>
        <td className="p-3 text-gray-800">{order.customer_name}</td>
        <td className="p-3 text-gray-800">
          {order.products || "—"}


        </td>
        <td className="p-3 font-semibold text-green-700">
          ₹{order.total_amount}
        </td>
        <td className="p-3 text-gray-600">
          {new Date(order.order_date).toLocaleDateString()}
        </td>
        <td className="p-3 flex justify-center gap-3">
          {/* <button
            onClick={() => onEdit(order.order_id)}
            className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1.5 rounded-lg shadow-sm transition-transform transform hover:scale-105"
          >
            <Edit3 size={16} /> Edit
          </button> */}
          <button
            onClick={() => deleteOrder(order.order_id)}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg shadow-sm transition-transform transform hover:scale-105"
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

export default OrderList;
