import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import Bubbles from "../animation/Bubbles";

const API = import.meta.env.VITE_API_URL;

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      localStorage.setItem("adminToken", data.token);
      navigate("/admin-dashboard");
    } catch (err) {
      console.log(err);
      setErrorMsg("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-[Poppins]">
      <Bubbles />

      {/* Back Button */}
      <Motion.button
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ scale: 1.03, opacity: 0.9 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 border border-gray-100 shadow-md text-gray-600 hover:cursor-pointer hover:shadow-[0_4px_8px_rgba(0,0,0,0.25)]"
      >
        <ArrowLeft size={18} />
        Back Home
      </Motion.button>

      {/* Login Card */}
      <Motion.div
        initial={{ opacity: 0, y: 45, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative z-10 bg-white/80 backdrop-blur-lg border border-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.15)] p-10 rounded-2xl w-[380px] sm:w-[450px]"
      >
        <Motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-3xl font-semibold mb-6 text-center text-gray-900"
        >
          Admin Login
        </Motion.h2>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <label className="block mb-2 font-medium text-gray-700">Email</label>
          <Motion.input
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  whileFocus={{ scale: 1.02 }}
  transition={{ delay: 0.25, duration: 0.35 }}
  type="email"
  className="w-full p-3 border rounded-lg mb-5 bg-white/70 backdrop-blur-md shadow-sm focus:outline-blue-500 cursor-pointer"
  placeholder="Enter email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>


          {/* Password */}
          <label className="block mb-2 font-medium text-gray-700">
            Password
          </label>

          <div className="relative mb-8">
            <Motion.input
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  whileFocus={{ scale: 1.02 }}
  transition={{ delay: 0.3, duration: 0.35 }}
  type={showPassword ? "text" : "password"}
  className="w-full p-3 pr-12 border rounded-lg bg-white/70 backdrop-blur-md shadow-sm focus:outline-blue-500 cursor-pointer"
  placeholder="Enter password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
/>


            {/* Eye Icon */}
            <Motion.button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
  whileHover={{ scale: 1.2 }}
  whileTap={{ scale: 0.9 }}
  transition={{ type: "spring", stiffness: 300, damping: 16 }}
>
  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
</Motion.button>

          </div>

          {/* ERROR MESSAGE */}
          {errorMsg && (
            <p className="text-red-600 text-sm mb-4 text-center">{errorMsg}</p>
          )}

          {/* Login Button */}
          <Motion.button
  type="submit"
  disabled={loading}
  whileHover={{ scale: 1.05, opacity: 0.92 }}
  whileTap={{ scale: 0.96 }}
  transition={{ type: "spring", stiffness: 300, damping: 18 }}
  className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 shadow-[0_4px_6px_rgba(0,0,0,0.3)] disabled:opacity-50"
>
  {loading ? "Logging in..." : "Login"}
</Motion.button>

        </form>
      </Motion.div>
    </div>
  );
};

export default AdminLogin;
