import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Package,
  ShoppingBag,
  Users,
  UserCircle,
  BarChart3,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const Dashboard = () => {
  const [counts, setCounts] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    suppliers: 0,
  });

  const [categoryData, setCategoryData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [
          productRes,
          orderRes,
          customerRes,
          supplierRes,
          categoryRes,
          stockRes,
          lowStockRes,
        ] = await Promise.all([
          axios.get("http://localhost:5000/api/products/count/all", { headers }),
          axios.get("http://localhost:5000/api/orders/count/all", { headers }),
          axios.get("http://localhost:5000/api/customers/count/all", { headers }),
          axios.get("http://localhost:5000/api/suppliers/count/all", { headers }),
          axios.get("http://localhost:5000/api/dashboard/category-distribution", { headers }),
          axios.get("http://localhost:5000/api/dashboard/stock-distribution", { headers }),
          axios.get("http://localhost:5000/api/products/low-stock", { headers }),
        ]);

        setCounts({
          products: productRes?.data?.count || 0,
          orders: orderRes?.data?.count || 0,
          customers: customerRes?.data?.count || 0,
          suppliers: supplierRes?.data?.count || 0,
        });

        setCategoryData(categoryRes?.data || []);
        setStockData(stockRes?.data || []);

        // ✅ FIXED: Update low stock data here
        setLowStock(lowStockRes?.data || []);
      } catch (error) {
        console.error("❌ Error fetching dashboard data:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
      }
    };

    fetchDashboardData();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#9B59B6", "#E74C3C"];

  const cards = [
    {
      title: "Total Products",
      value: counts.products,
      icon: <Package size={32} className="text-blue-600" />,
    },
    {
      title: "Total Orders",
      value: counts.orders,
      icon: <ShoppingBag size={32} className="text-green-600" />,
    },
    {
      title: "Total Customers",
      value: counts.customers,
      icon: <UserCircle size={32} className="text-purple-600" />,
    },
    {
      title: "Total Suppliers",
      value: counts.suppliers,
      icon: <Users size={32} className="text-orange-600" />,
    },
  ];

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">📊 Dashboard Overview</h1>

      {/* ✅ Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between hover:shadow-xl transition-all duration-300"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-600">{card.title}</h2>
              <p className="text-4xl font-bold text-gray-900 mt-2">{card.value}</p>
            </div>
            {card.icon}
          </div>
        ))}
      </div>

      {/* ✅ Pie + Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        {/* 🥧 Product Category Distribution */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              📦 Product Category Distribution
            </h2>
            <span className="text-sm text-gray-500 bg-blue-100 px-3 py-1 rounded-full font-medium">
              Real-Time Insights
            </span>
          </div>

          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={70}
                  paddingAngle={5}
                  stroke="#fff"
                  strokeWidth={2}
                  label={({ category, percent }) =>
                    `${category} ${(percent * 100).toFixed(1)}%`
                  }
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    border: "none",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center">No category data available.</p>
          )}
        </div>

        {/* 📊 Product Stock Distribution */}
        <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <BarChart3 className="text-green-600" /> Product Stock Distribution
            </h2>
            <span className="text-sm text-gray-500 bg-green-100 px-3 py-1 rounded-full font-medium">
              Inventory Overview
            </span>
          </div>

          {stockData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={stockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="stock" fill="#10B981" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center">No stock data available.</p>
          )}
        </div>
      </div>

      {/* ⚠️ Low Stock Alerts */}
      <div className="mt-10 bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            ⚠️ Low Stock Alerts
          </h2>
          <span className="text-sm text-gray-500 bg-red-100 px-3 py-1 rounded-full font-medium">
            Inventory Warnings
          </span>
        </div>

        {lowStock.length > 0 ? (
          <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
            <thead className="bg-red-100">
              <tr>
                <th className="py-3 px-4 text-left">Product</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Stock Quantity</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.map((item) => (
                <tr key={item.product_id} className="border-b hover:bg-red-50">
                  <td className="py-2 px-4 font-medium text-gray-700">{item.name}</td>
                  <td className="py-2 px-4 text-gray-600">{item.category}</td>
                  <td className="py-2 px-4 font-semibold text-red-600">{item.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-green-600 font-medium text-center">
            All products are sufficiently stocked ✅
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
