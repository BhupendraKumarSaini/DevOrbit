import React, { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Bubbles from "../animation/Bubbles";
import EditHero from "../admin/EditHero";
import EditAbout from "../admin/EditAbout";
import EditSkills from "../admin/EditSkills";
import EditExperience from "../admin/EditExperience";
import EditProjects from "../admin/EditProjects";
import EditEducation from "../admin/EditEducation";
import EditFooter from "../admin/EditFooter";
import Skeleton from "../component/ui/Skeleton";
import { fadeUp, scaleIn, hover, tap } from "../animation/motion";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminDashboard = () => {
  const { logout } = useAdminAuth();

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
    { name: "Experience", id: "experience" },
    { name: "Projects", id: "projects" },
    { name: "Education", id: "education" },
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

  const handleLogout = () => {
    logout();
    navigate(-2);
  };

  return (
    <div className="min-h-screen flex flex-col font-[Poppins]">
      <Bubbles />
      {/* NAVBAR */}
      <Motion.nav
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl bg-white/80 backdrop-blur-md border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.15)] rounded-2xl px-6 py-3"
      >
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <Motion.div
            whileHover={hover}
            whileTap={tap}
            onClick={() => changePage("welcome")}
            className="flex items-center gap-2 cursor-pointer shrink-0"
          >
            <img src="/orbit.png" width="26" alt="DevOrbit" />
            <span className="text-xl font-semibold">DevOrbit</span>
          </Motion.div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-3 lg:gap-7">
            {pages.map((p) => (
              <Motion.button
                key={p.id}
                whileHover={hover}
                whileTap={tap}
                onClick={() => changePage(p.id)}
                className={
                  activePage === p.id
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-blue-600"
                }
              >
                {p.name}
              </Motion.button>
            ))}

            {/* LOGOUT CTA */}
            <Motion.button
              whileHover={hover}
              whileTap={tap}
              onClick={handleLogout}
              className="ml-2 px-4 py-1.5 rounded-xl bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </Motion.button>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="md:hidden cursor-pointer"
            onClick={() => setOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {open && (
            <Motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="mt-4 w-full bg-white/95 rounded-2xl py-6 flex flex-col items-center gap-5 md:hidden"
            >
              {pages.map((p) => (
                <Motion.button
                  key={p.id}
                  whileHover={hover}
                  whileTap={tap}
                  onClick={() => changePage(p.id)}
                  className={
                    activePage === p.id
                      ? "text-blue-600 font-semibold text-lg"
                      : "text-gray-700 text-lg hover:text-blue-600"
                  }
                >
                  {p.name}
                </Motion.button>
              ))}

              <Motion.button
                whileHover={hover}
                whileTap={tap}
                onClick={handleLogout}
                className="mt-2 px-6 py-2 rounded-xl bg-red-600 text-white flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </Motion.button>
            </Motion.div>
          )}
        </AnimatePresence>
      </Motion.nav>

      {/* CONTENT */}
      <div className="flex-1 flex justify-center items-start pt-30">
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
        {activePage === "experience" && <EditExperience />}
        {activePage === "projects" && <EditProjects />}
        {activePage === "education" && <EditEducation />}
        {activePage === "footer" && <EditFooter />}
      </div>
    </div>
  );
};

export default AdminDashboard;
