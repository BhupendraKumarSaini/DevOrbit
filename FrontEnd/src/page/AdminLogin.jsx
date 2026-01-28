import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import Bubbles from "../animation/Bubbles";
import { fadeUp, scaleIn, hover, tap } from "../animation/motion";
import { apiFetch } from "../lib/api";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminLogin = () => {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const data = await apiFetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      login(data.token);
      navigate("/admin-dashboard");
    } catch (err) {
      setErrorMsg(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-[Poppins]">
      <Bubbles />

      {/* BACK BUTTON */}
      <Motion.button
        variants={fadeUp}
        initial="hidden"
        animate="show"
        whileHover={hover}
        whileTap={tap}
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 backdrop-blur border border-gray-200 shadow-md"
      >
        <ArrowLeft size={18} />
        Back Home
      </Motion.button>

      {/* LOGIN CARD */}
      <Motion.div
        variants={scaleIn}
        initial="hidden"
        animate="show"
        className="relative z-10 bg-white/80 backdrop-blur-lg border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.15)] p-10 rounded-2xl w-[380px] sm:w-[450px]"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center">Admin Login</h2>

        <form onSubmit={handleLogin}>
          {/* EMAIL */}
          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            className="w-full p-3 border rounded-lg mb-5 focus:outline-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* PASSWORD */}
          <label className="block mb-2 font-medium">Password</label>
          <div className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-3 pr-12 border rounded-lg focus:outline-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Motion.button
              type="button"
              whileHover={hover}
              whileTap={tap}
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              aria-label="Toggle password"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </Motion.button>
          </div>

          {/* ERROR */}
          {errorMsg && (
            <p className="text-red-600 text-sm mb-4 text-center">{errorMsg}</p>
          )}

          {/* LOGIN */}
          <Motion.button
            type="submit"
            disabled={loading}
            whileHover={hover}
            whileTap={tap}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </Motion.button>
        </form>
      </Motion.div>
    </div>
  );
};

export default AdminLogin;
