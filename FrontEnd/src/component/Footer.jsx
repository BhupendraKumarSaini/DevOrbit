import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const Footer = () => {
  const [footer, setFooter] = useState(null);
  const isMobile = window.innerWidth < 768; // 👈 Detect mobile

  /* FETCH FOOTER */
  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await fetch(`${API}/api/footer`);
        const data = await res.json();
        setFooter(data);
      } catch (err) {
        console.log("Failed to fetch footer", err);
      }
    };
    fetchFooter();
  }, []);

  /* FORCE DOWNLOAD RESUME */
  const downloadResume = async () => {
    if (!footer?.resume) return;

    const url = `${API}/uploads/resume/${footer.resume}`;
    const res = await fetch(url);
    const blob = await res.blob();

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);

    const fileName = footer.resume.split("-").slice(1).join("-");
    link.download = fileName;
    link.click();
  };

  if (!footer) return null;

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { name: "Home", action: () => scrollToSection("home") },
    { name: "About", action: () => scrollToSection("about") },
    { name: "Skills", action: () => scrollToSection("skills") },
    { name: "Projects", action: () => scrollToSection("projects") },
    { name: "Resume", action: downloadResume },
  ];

  return (
    <Motion.section
      {...(!isMobile && {
        initial: { y: 60, opacity: 0 },
        whileInView: { y: 0, opacity: 1 },
        transition: { duration: 0.6, ease: "easeOut" },
      })}
      className="px-4 sm:px-6 md:px-12 lg:px-16 mt-8 pt-8 shadow-[0_-1px_4px_rgba(0,0,0,0.1)] bg-white/40 font-[Poppins]"
    >
      <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-12 lg:gap-20 text-center md:text-left md:justify-between max-w-[1100px] mx-auto">
        
        <Motion.a
          onClick={() => scrollToSection("home")}
          className="flex items-center gap-2 cursor-pointer mx-auto md:mx-0"
          {...(!isMobile && {
            whileHover: { scale: 1.08, opacity: 0.85 },
            transition: { type: "spring", stiffness: 300, damping: 18 },
          })}
        >
          <img src="/orbit.png" alt="DevOrbit" className="w-6 h-6" />
          <h1 className="text-xl font-semibold text-black">DevOrbit</h1>
        </Motion.a>

        {/* NAV LINKS */}
        <ul className="flex flex-wrap justify-center gap-3 sm:gap-5 text-gray-700 md:flex-1 md:mx-4">
          {navLinks.map((item, index) => (
            <Motion.li
              key={index}
              className="cursor-pointer"
              {...(!isMobile && {
                whileHover: { scale: 1.08, opacity: 0.85 },
                transition: { type: "spring", stiffness: 300, damping: 18 },
              })}
            >
              <button
                type="button"
                onClick={item.action}
                className="bg-transparent border-none p-0 text-gray-700 hover:text-blue-600"
              >
                {item.name}
              </button>
            </Motion.li>
          ))}
        </ul>

        {/* SOCIAL ICONS */}
        <div className="flex gap-3 sm:gap-5 justify-center md:justify-end">
          {[ 
            { icon: Github, href: footer.github },
            { icon: Linkedin, href: footer.linkedin },
            { icon: Mail, href: `mailto:${footer.email}` },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <Motion.a
                key={i}
                href={item.href}
                target="_blank"
                className="p-2 rounded-full bg-white/40 border border-white/30 shadow-md"
                {...(!isMobile && {
                  whileHover: { scale: 1.15, opacity: 0.9 },
                  whileTap: { scale: 0.9 },
                  transition: { type: "spring", stiffness: 300, damping: 16 },
                })}
              >
                <Icon className="w-5 h-5 text-gray-700" />
              </Motion.a>
            );
          })}
        </div>
      </div>

      <div className="w-full h-px bg-gray-300/40 my-8"></div>

      <p className="text-center text-gray-600 text-xs sm:text-sm pb-8">
        © {new Date().getFullYear()} <span className="font-medium">Bhupendra Saini</span>. All Rights Reserved.
      </p>
    </Motion.section>
  );
};

export default Footer;
