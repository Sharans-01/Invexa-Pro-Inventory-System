import React, { useState } from "react";
import { useNavigate, NavLink, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import {
  FaBox,
  FaClipboardList,
  FaTags,
  FaSignOutAlt,
  FaTachometerAlt,
  FaTruck,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50">
      {/* ✅ Fixed Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </header>

      <div className="flex flex-1 pt-16">
        {/* ✅ Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: -250, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -250, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-64 bg-white/90 backdrop-blur-md shadow-xl fixed top-16 left-0 bottom-0 flex flex-col justify-between border-r border-gray-200"
            >
              <div>
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent text-center">
                    IMS Dashboard
                  </h2>
                </div>

                {/* Sidebar Links */}
                <nav className="mt-4 flex flex-col space-y-1 px-4">
                  {[
                    { to: "/dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
                    { to: "/products", icon: <FaBox />, label: "Products" },
                    { to: "/customers", icon: <FaTags />, label: "Customers" },
                    { to: "/orders", icon: <FaClipboardList />, label: "Orders" },
                    { to: "/suppliers", icon: <FaTruck />, label: "Suppliers" },
                  ].map(({ to, icon, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 p-3 rounded-lg font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md"
                            : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                        }`
                      }
                    >
                      {icon}
                      {label}
                    </NavLink>
                  ))}
                </nav>
              </div>

              {/* ✅ Logout Button */}
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full text-red-600 font-semibold bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-all"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ✅ Sidebar Toggle Button (for mobile) */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-20 left-4 z-40 bg-indigo-600 text-white p-2 rounded-full shadow-lg md:hidden"
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* ✅ Main Content Area */}
        <main
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-0"
          } p-6 overflow-y-auto`}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-md min-h-[90vh] border border-gray-100"
          >
            <Outlet />
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
