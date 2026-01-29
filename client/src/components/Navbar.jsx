import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaSignOutAlt, FaUser } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const username = localStorage.getItem("username") || "User";
  const userRole = localStorage.getItem("userRole") || "Admin";
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 shadow-lg px-6 py-3 flex justify-between items-center">
      
      {/* Logo Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3"
      >
        <img
          src="/ims logo1.png"
          alt="Inventory Logo"
          className="w-10 h-10 rounded-lg shadow-md bg bg-white "
        />
        <div className="leading-tight">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white font-inter">
  Invexa Pro
</h1>

          <p className="text-xs text-gray-200">Smart Inventory. Simplified.</p>
        </div>
      </motion.div>

      

      {/* Profile Section */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 bg-white/10 px-3 py-2 rounded-full hover:bg-white/20 transition-all"
        >
          <div className="relative">
            <FaUserCircle className="text-3xl text-white" />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-indigo-600 rounded-full"></span>
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-sm font-semibold text-white">
              {username}
            </span>
            <span className="text-xs text-gray-200">{userRole}</span>
          </div>
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl overflow-hidden z-50"
            >
              <ul className="text-sm text-gray-700">
                <li className="flex items-center gap-2 px-4 py-3 hover:bg-indigo-50 cursor-pointer">
                  <FaUser className="text-indigo-500" />
                  Profile
                </li>

                <li
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-3 hover:bg-red-50 cursor-pointer text-red-600"
                >
                  <FaSignOutAlt />
                  Logout
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
