import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBoxOpen } from "react-icons/fa";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        toast.success("Login Successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        toast.error(res.data.message || "Invalid credentials!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Login failed! Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500 px-4">
      <Toaster position="top-center" reverseOrder={false} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-8 transform hover:scale-[1.02] transition-all"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="bg-indigo-100 p-4 rounded-full mb-3 shadow-inner">
            <FaBoxOpen className="text-indigo-600 text-5xl" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 text-center">
            Inventory Management System
          </h2>
          <p className="text-gray-500 text-sm mt-1 tracking-wide">
            Admin / Staff Login
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            Login
          </motion.button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} IMS Portal. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
