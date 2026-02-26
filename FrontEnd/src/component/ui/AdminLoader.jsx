import React from "react";
import { motion as Motion } from "framer-motion";

const AdminLoader = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4 font-[Poppins]">
      <Motion.div
        className="relative w-14 h-14"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <div className="absolute inset-0 border-4 border-blue-200 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full" />
      </Motion.div>

      <p className="text-gray-500 text-sm tracking-wide">{text}</p>
    </div>
  );
};

export default AdminLoader;
