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
        toast.success("Welcome to Invexa Pro");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        toast.error(res.data.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error("Login failed. Try again.");
    }
  };

  return (
   <div
  className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4"
  style={{ backgroundImage: "url('/loginbg.jpg')" }}
>

      <Toaster position="top-center" />

      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-indigo-900/60 to-black/80"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="bg-indigo-600 p-4 rounded-full shadow-lg mb-3">
            <FaBoxOpen className="text-white text-4xl" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-wide">
            Invexa Pro
          </h2>
          <p className="text-indigo-200 text-sm mt-1">
            Smart Inventory Management
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-indigo-100 text-sm font-medium mb-1 block">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@invexa.com"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-indigo-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-indigo-100 text-sm font-medium mb-1 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-indigo-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition"
          >
            Sign In
          </motion.button>
        </form>

        <p className="text-center text-indigo-200 text-xs mt-6">
          © {new Date().getFullYear()} Invexa Pro. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
