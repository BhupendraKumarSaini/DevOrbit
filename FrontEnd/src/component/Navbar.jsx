import React, { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import toast from "react-hot-toast";
import { fadeDown, fadeUp, hover, tap } from "../animation/motion";
import { apiFetch } from "../lib/api";

const API = import.meta.env.VITE_API_URL;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [resume, setResume] = useState("");

  useEffect(() => {
    apiFetch("/api/footer")
      .then((d) => setResume(d?.resume || ""))
      .catch(() => toast.error("Failed to load resume"));
  }, []);

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, []);

  const downloadResume = async () => {
    if (!resume) return toast.error("Resume not available");

    const id = toast.loading("Downloading resume...");
    try {
      const res = await fetch(`${API}/uploads/resume/${resume}`);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = resume.replace(/^\d+-/, "");
      link.click();
      toast.success("Downloaded", { id });
    } catch {
      toast.error("Download failed", { id });
    } finally {
      setOpen(false);
    }
  };

  const scrollTo = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const links = [
    { name: "Home", action: () => scrollTo("home") },
    { name: "About", action: () => scrollTo("about") },
    { name: "Skills", action: () => scrollTo("skills") },
    { name: "Experience", action: () => scrollTo("experience") },
    { name: "Projects", action: () => scrollTo("projects") },
    { name: "Education", action: () => scrollTo("education") },
  ];

  return (
    <Motion.nav
      variants={fadeDown}
      initial="hidden"
      animate="show"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl bg-white/80 backdrop-blur-md border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.15)] rounded-2xl px-6 py-3 font-[Poppins]"
    >
      <div className="flex items-center justify-between">
        {/* LOGO */}
        <Motion.div
          whileHover={hover}
          whileTap={tap}
          onClick={() => scrollTo("home")}
          className="flex items-center gap-2 cursor-pointer shrink-0"
        >
          <img src="/orbit.png" width="26" alt="DevOrbit" />
          <span className="text-xl font-semibold">DevOrbit</span>
        </Motion.div>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-5 lg:gap-7 text-gray-700">
          {links.map((l) => (
            <Motion.button
              key={l.name}
              whileHover={hover}
              whileTap={tap}
              onClick={l.action}
              className="relative hover:text-blue-600"
            >
              {l.name}
            </Motion.button>
          ))}

          {/* RESUME CTA */}
          <Motion.button
            whileHover={hover}
            whileTap={tap}
            onClick={downloadResume}
            className="ml-2 px-4 py-1.5 rounded-xl bg-blue-600 text-white"
          >
            Resume
          </Motion.button>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((p) => !p)}
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
            {links.map((l) => (
              <Motion.button
                key={l.name}
                whileHover={hover}
                whileTap={tap}
                onClick={l.action}
                className="text-lg hover:text-blue-600"
              >
                {l.name}
              </Motion.button>
            ))}

            <Motion.button
              whileHover={hover}
              whileTap={tap}
              onClick={downloadResume}
              className="mt-2 px-6 py-2 rounded-xl bg-blue-600 text-white"
            >
              Resume
            </Motion.button>
          </Motion.div>
        )}
      </AnimatePresence>
    </Motion.nav>
  );
};

export default Navbar;
