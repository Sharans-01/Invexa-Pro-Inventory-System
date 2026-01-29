import React, { useState, useEffect } from "react";
import API from "../../api/api";
import { PlusCircle, XCircle, ClipboardList, ShoppingCart } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const AddOrder = ({ orderData, onCancel }) => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [order, setOrder] = useState({
    customer_id: "",
    order_date: "",
    items: [],
  });

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    if (orderData) setOrder(orderData);
  }, [orderData]);

  const fetchCustomers = async () => {
    const res = await API.get("/customers");
    setCustomers(res.data);
  };

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  const addItem = () => {
    setOrder({
      ...order,
      items: [...order.items, { product_id: "", quantity: 1, price: 0 }],
    });
  };

  const handleItemChange = (index, field, value) => {
    const items = [...order.items];
    items[index][field] = value;
    setOrder({ ...order, items });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const total_amount = order.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const formattedOrder = {
      customer_id: order.customer_id,
      order_date:
        order.order_date || new Date().toISOString().slice(0, 19).replace("T", " "),
      total_amount,
      status: order.status || "Pending",
      items: order.items.map((i) => ({
        product_id: i.product_id,
        quantity: i.quantity,
        price: i.price,
      })),
    };

    try {
      if (order.order_id) {
        await API.put(`/orders/${order.order_id}`, formattedOrder);
        toast.success("Order updated successfully!", {
          style: { background: "#ecfdf5", color: "#065f46" },
          iconTheme: { primary: "#10b981", secondary: "#fff" },
        });
      } else {
        await API.post("/orders", formattedOrder);
        toast.success("Order added successfully!", {
          style: { background: "#ecfdf5", color: "#065f46" },
          iconTheme: { primary: "#10b981", secondary: "#fff" },
        });
      }
      setTimeout(onCancel, 1000);
    } catch (err) {
      console.error("Error saving order:", err);
      toast.error("Failed to save order", {
        style: { background: "#fef2f2", color: "#991b1b" },
        iconTheme: { primary: "#dc2626", secondary: "#fff" },
      });
    }
  };

  return (
    <div className="p-8 bg-white rounded-2xl shadow-xl border border-gray-100 max-w-4xl mx-auto relative">
      {/* Toast Container */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex items-center gap-3 mb-6">
        <ShoppingCart className="text-blue-600 w-8 h-8" />
        <h2 className="text-3xl font-bold text-gray-800">
          {order.order_id ? "Edit Order" : "Add New Order"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Selection */}
        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Select Customer
          </label>
          <select
            value={order.customer_id}
            onChange={(e) => setOrder({ ...order, customer_id: e.target.value })}
            required
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-50 hover:bg-gray-100 transition"
          >
            <option value="">-- Choose Customer --</option>
            {customers.map((c) => (
              <option key={c.customer_id} value={c.customer_id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Order Items Section */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold text-blue-700 flex items-center gap-2">
              <ClipboardList className="w-5 h-5" /> Order Items
            </h3>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-medium px-3 py-1.5 rounded-lg hover:from-teal-600 hover:to-emerald-700 transition-all shadow-sm hover:shadow-md"
            >
              <PlusCircle size={18} /> Add Item
            </button>
          </div>

          {order.items.length === 0 && (
            <p className="text-gray-500 text-sm italic text-center py-3">
              No items added yet. Click “Add Item” to start.
            </p>
          )}

          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex flex-wrap md:flex-nowrap gap-3 mb-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
            >
              <select
                value={item.product_id}
                onChange={(e) =>
                  handleItemChange(index, "product_id", e.target.value)
                }
                required
                className="border border-gray-300 rounded-lg p-2 w-full md:w-1/2 focus:ring-2 focus:ring-blue-400 bg-gray-50"
              >
                <option value="">Select Product</option>
                {products.length > 0 ? (
                  products.map((p) => (
                    <option
                      key={p.product_id || p.id}
                      value={p.product_id || p.id}
                    >
                      {p.name || p.product_name || "Unnamed Product"}
                    </option>
                  ))
                ) : (
                  <option disabled>No Products Available</option>
                )}
              </select>

              <input
                type="number"
                placeholder="Qty"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                className="border border-gray-300 rounded-lg p-2 w-full md:w-1/4 focus:ring-2 focus:ring-blue-400"
              />

              <input
                type="number"
                placeholder="Price"
                min="0"
                value={item.price}
                onChange={(e) =>
                  handleItemChange(index, "price", e.target.value)
                }
                className="border border-gray-300 rounded-lg p-2 w-full md:w-1/4 focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 bg-red-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-red-600 transition"
          >
            <XCircle size={18} /> Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
          >
            <ClipboardList size={18} />
            {order.order_id ? "Update Order" : "Submit Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOrder;
