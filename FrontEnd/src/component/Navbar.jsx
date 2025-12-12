import React, { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [resume, setResume] = useState("");

  /* fetch resume from DB */
  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await fetch(`${API}/api/footer`);
        const data = await res.json();
        setResume(data?.resume || "");
      } catch (err) {
        console.log("Failed to fetch resume:", err);
      }
    };
    fetchFooter();
  }, []);

  /* Force Resume Download */
  const handleResumeDownload = async () => {
    if (!resume) return;

    try {
      const url = `${API}/uploads/resume/${resume}`;
      const resFile = await fetch(url);
      const blob = await resFile.blob();

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "Bhupendra-Resume.pdf";
      link.click();
    } catch (err) {
      console.log("Resume download failed:", err);
    }

    setOpen(false);
  };

  const scrollToSection = (id) => {
    setOpen(false);
    const delay = window.innerWidth < 768 ? 0 : 500;
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        if (window.innerWidth < 768) {
          element.scrollIntoView({ behavior: 'auto', block: 'start' });
        } else {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }, delay);
  };

  const navLinks = [
    { name: "Home", action: () => scrollToSection("home") },
    { name: "About", action: () => scrollToSection("about") },
    { name: "Skills", action: () => scrollToSection("skills") },
    { name: "Projects", action: () => scrollToSection("projects") },
    { name: "Resume", action: handleResumeDownload },
  ];

  return (
    <>
      <Motion.nav
        initial={{ y: -50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: false, amount: 0.4 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-4 left-1/2 -translate-x-1/2 flex items-center bg-white/80 backdrop-blur-md  border border-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.2)] py-3 sm:py-4 px-4 sm:px-5 rounded-2xl w-[94%] sm:w-[85%] md:w-[75%] lg:w-[60%] z-50 font-[Poppins]"
      >
        {/* Logo */}
        <Motion.a
          onClick={() => scrollToSection("home")}
          className="flex items-center gap-1.5 hover:cursor-pointer"
          whileHover={{ scale: 1.06, opacity: 0.85 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
        >
          <img src="/orbit.png" width="23" />
          <h1 className="text-lg sm:text-xl font-semibold text-black">
            DevOrbit
          </h1>
        </Motion.a>

        {/* Desktop Menu */}
        <div className="hidden md:flex ml-auto gap-6 lg:gap-7 text-gray-700 text-sm lg:text-base">
          {navLinks.map((link, index) => (
            <Motion.a
              key={index}
              onClick={link.action}
              className="cursor-pointer hover:text-blue-600"
              whileHover={{ scale: 1.08, opacity: 0.85 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              {link.name}
            </Motion.a>
          ))}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden ml-auto hover:cursor-pointer p-1.5 rounded-lg active:scale-95"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Mobile Menu */}
        {open && (
          <div className="absolute top-18 left-0 w-full bg-white/95 backdrop-blur-md border border-white/30  shadow-lg rounded-2xl py-6 px-5 flex flex-col items-center gap-5 text-gray-700 text-base md:hidden">
            {navLinks.map((link, index) => (
              <Motion.a
                key={index}
                onClick={link.action}
                className="cursor-pointer hover:text-blue-600"
                whileHover={{ scale: 1.08, opacity: 0.85 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              >
                {link.name}
              </Motion.a>
            ))}
          </div>
        )}
      </Motion.nav>
    </>
  );
};

export default Navbar;
