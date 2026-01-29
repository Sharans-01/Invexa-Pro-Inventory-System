import React, { useState, useEffect } from "react";
import OrderList from "../components/Orders/OrderList.jsx";
import AddOrder from "../components/Orders/AddOrder.jsx";

import API from "../api/api";

const Orders = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const handleAdd = () => {
    setEditingOrder(null);
    setIsAdding(true);
  };

  const handleEdit = async (orderId) => {
    try {
      const res = await API.get(`/orders/${orderId}`);
      setEditingOrder(res.data); // load full order + items
      setIsAdding(true);
    } catch (error) {
      console.error("Failed to fetch order for editing:", error);
      alert("Failed to load order details");
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingOrder(null);
  };

  return (
    
    <div className="p-6">
      {!isAdding ? (
        <OrderList onAdd={handleAdd} onEdit={handleEdit} />
      ) : (
        <AddOrder orderData={editingOrder} onCancel={handleCancel} />
      )}
    </div>
    
  );
};

export default Orders;
