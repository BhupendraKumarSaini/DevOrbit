import React, { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import { Menu, X, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Bubbles from "../animation/Bubbles";
import EditHero from "../admin/EditHero";
import EditAbout from "../admin/EditAbout";
import EditSkills from "../admin/EditSkills";
import EditProjects from "../admin/EditProjects";
import EditFooter from "../admin/EditFooter";
import Skeleton from "../component/ui/Skeleton";

import { fadeUp, scaleIn, hover, tap } from "../animation/motion";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const initialPage =
    performance.getEntriesByType("navigation")[0]?.type === "reload"
      ? localStorage.getItem("dashboardPage") || "welcome"
      : "welcome";

  const [activePage, setActivePage] = useState(initialPage);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const pages = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Skills", id: "skills" },
    { name: "Projects", id: "projects" },
    { name: "Footer", id: "footer" },
  ];

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const changePage = (id) => {
    setActivePage(id);
    localStorage.setItem("dashboardPage", id);
    setOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("dashboardPage");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col font-[Poppins]">
      <Bubbles />

      {/* NAVBAR */}
      <Motion.nav
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] sm:w-[85%] md:w-[75%] lg:w-[60%] bg-white/80 backdrop-blur-md border shadow rounded-2xl px-5 py-4 flex items-center z-50"
      >
        <Motion.div
          whileHover={hover}
          whileTap={tap}
          onClick={() => changePage("welcome")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img src="/orbit.png" width="22" alt="DevOrbit" />
          <span className="font-semibold text-lg">DevOrbit</span>
        </Motion.div>

        {/* DESKTOP */}
        <div className="hidden md:flex ml-auto gap-6 items-center">
          {pages.map((p) => (
            <Motion.button
              key={p.id}
              whileHover={hover}
              whileTap={tap}
              onClick={() => changePage(p.id)}
              className={
                activePage === p.id
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700"
              }
            >
              {p.name}
            </Motion.button>
          ))}

          <Motion.button
            whileHover={hover}
            whileTap={tap}
            onClick={logout}
            className="text-red-600 flex items-center gap-1"
          >
            <LogOut size={18} />
            Logout
          </Motion.button>
        </div>

        {/* MOBILE */}
        <button
          onClick={() => setOpen((p) => !p)}
          className="md:hidden ml-auto"
        >
          {open ? <X /> : <Menu />}
        </button>
      </Motion.nav>

      {/* CONTENT */}
      <div className="flex-1 flex justify-center items-start pt-32">
        {activePage === "welcome" && (
          <Motion.div
            variants={scaleIn}
            initial="hidden"
            animate="show"
            className="w-[90%] max-w-3xl bg-white p-10 rounded-2xl shadow text-center"
          >
            {loading ? (
              <>
                <Skeleton className="h-8 w-2/3 mx-auto mb-4" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </>
            ) : (
              <>
                <h2 className="text-3xl font-semibold">
                  Welcome to Admin Dashboard 👋
                </h2>
                <p className="mt-3 text-gray-600">
                  Choose a section to edit your portfolio.
                </p>
              </>
            )}
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
