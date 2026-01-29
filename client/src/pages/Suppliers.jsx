import React, { useState } from "react";
import SupplierList from "../components/suppliers/SupplierList";
import AddSupplier from "../components/suppliers/AddSupplier";
import DashboardLayout from "../components/DashboardLayout";
const Suppliers = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    
    <div className="p-6">
      {showAddForm ? (
        <AddSupplier
          onCancel={() => setShowAddForm(false)}
          onSuccess={() => setShowAddForm(false)}
        />
      ) : (
        <SupplierList onAdd={() => setShowAddForm(true)} />
      )}
    </div>
  
  );
};

export default Suppliers;
