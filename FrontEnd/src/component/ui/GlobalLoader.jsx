import React from "react";
import { motion as Motion } from "framer-motion";

const GlobalLoader = () => {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white">
      {/* Floating subtle background glow */}
      <div className="absolute w-[400px] h-[400px] bg-blue-200/40 rounded-full blur-3xl animate-pulse" />

      {/* Animated orbit */}
      <Motion.div
        className="relative w-24 h-24 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
      >
        {/* Orbit ring */}
        <div className="absolute inset-0 border-4 border-blue-400/40 rounded-full" />

        {/* Moving dot */}
        <Motion.div
          className="absolute w-4 h-4 bg-blue-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          style={{ transformOrigin: "40px 40px" }}
        />

        {/* Center Logo */}
        <img src="/orbit.png" alt="Loading" className="w-10" />
      </Motion.div>
    </div>
  );
};

export default GlobalLoader;
