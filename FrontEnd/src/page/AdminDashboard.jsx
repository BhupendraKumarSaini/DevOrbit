import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import { Menu, X, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Bubbles from "../animation/Bubbles";
import EditHero from "../admin/EditHero";
import EditAbout from "../admin/EditAbout";
import EditSkills from "../admin/EditSkills";
import EditProjects from "../admin/EditProjects";
import EditFooter from "../admin/EditFooter";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Detect refresh or fresh navigation BEFORE render
  const initialPage = (() => {
    const nav = performance.getEntriesByType("navigation")[0]?.type;

    if (nav === "reload") {
      return localStorage.getItem("dashboardPage") || "welcome";
    }

    localStorage.removeItem("dashboardPage");
    return "welcome";
  })();

  const [activePage, setActivePage] = useState(initialPage);
  const [open, setOpen] = useState(false);

  const pages = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Skills", id: "skills" },
    { name: "Projects", id: "projects" },
    { name: "Footer", id: "footer" },
  ];

  const changePage = (pageId) => {
    setActivePage(pageId);
    localStorage.setItem("dashboardPage", pageId);
  };

  const goToWelcome = () => {
    localStorage.removeItem("dashboardPage");
    setActivePage("welcome");
  };

  // LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("dashboardPage");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col font-[Poppins]">
      <Bubbles />

      {/* NAVBAR */}
      <Motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] sm:w-[85%] md:w-[75%] lg:w-[60%] bg-white/80 backdrop-blur-md border border-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.2)] flex items-center justify-between py-4 px-5 rounded-2xl z-50"
      >
        {/* LOGO */}
        <Motion.div
          className="flex items-center gap-2 cursor-pointer"
          onClick={goToWelcome}
          whileHover={{ scale: 1.08, opacity: 0.85 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
        >
          <img src="/orbit.png" width="23" />
          <h1 className="text-xl font-semibold text-black">DevOrbit</h1>
        </Motion.div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-6 text-gray-700 items-center">
          {pages.map((p) => (
            <Motion.span
              key={p.id}
              onClick={() => changePage(p.id)}
              whileHover={{ scale: 1.08, opacity: 0.9 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className={`cursor-pointer hover:text-blue-600 ${
                activePage === p.id ? "text-blue-600 font-semibold" : ""
              }`}
            >
              {p.name}
            </Motion.span>
          ))}

          <Motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.08, opacity: 0.9 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="flex items-center gap-1 text-red-600 hover:text-red-800"
          >
            <LogOut size={18} />
            Logout
          </Motion.button>
        </div>

        {/* MOBILE MENU ICON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden hover:cursor-pointer"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* MOBILE MENU */}
        {open && (
          <Motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="absolute top-20 left-0 w-full bg-white/90 p-6 rounded-2xl flex flex-col gap-4 md:hidden items-center"
          >
            {pages.map((p) => (
              <Motion.span
                key={p.id}
                onClick={() => {
                  changePage(p.id);
                  setOpen(false);
                }}
                whileHover={{ scale: 1.1, opacity: 0.9 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="cursor-pointer hover:text-blue-600"
              >
                {p.name}
              </Motion.span>
            ))}

            <Motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.1, opacity: 0.9 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="flex justify-center items-center gap-2 text-red-600 hover:text-red-800"
            >
              <LogOut size={18} />
              Logout
            </Motion.button>
          </Motion.div>
        )}
      </Motion.nav>

      {/* CONTENT AREA */}
      <div className="flex-1 w-full flex justify-center items-start overflow-hidden">
        {activePage === "welcome" && (
          <Motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-[90%] max-w-3xl bg-white p-10 rounded-2xl shadow-lg border border-gray-200 text-center mt-55"
          >
            <h2 className="text-3xl font-semibold text-gray-800">
              Welcome to Admin Dashboard 👋
            </h2>
            <p className="mt-3 text-gray-600">
              Choose a section from above to modify your portfolio content.
            </p>
          </Motion.div>
        )}

        {activePage === "home" && <EditHero />}
        {activePage === "about" && <EditAbout />}
        {activePage === "skills" && <EditSkills />}
        {activePage === "projects" && <EditProjects />}
        {activePage === "footer" && <EditFooter />}
      </div>
    </div>
  );
};

export default AdminDashboard;
