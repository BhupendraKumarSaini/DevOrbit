import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import Skeleton from "./ui/Skeleton";
import toast from "react-hot-toast";
import { fadeUp, hover, tap } from "../animation/motion";
import { apiFetch } from "../lib/api";

const API = import.meta.env.VITE_API_URL;

const Footer = () => {
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    apiFetch("/api/footer")
      .then(setFooter)
      .catch(() => toast.error("Failed to load footer"));
  }, []);

  /* LOADING */
  if (!footer) {
    return (
      <section className="py-10">
        <Skeleton className="h-6 w-40 mx-auto mb-6" />
        <div className="flex justify-center gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-10 rounded-full" />
          ))}
        </div>
      </section>
    );
  }

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <Motion.footer
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="mt-20 pt-10 pb-6 bg-white/40 shadow-[0_-1px_4px_rgba(0,0,0,0.1)] font-[Poppins]"
    >
      <div className="max-w-[1100px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* LOGO */}
        <Motion.div
          whileHover={hover}
          whileTap={tap}
          onClick={() => scrollTo("home")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img src="/orbit.png" className="w-6" alt="DevOrbit" />
          <span className="text-xl font-semibold">DevOrbit</span>
        </Motion.div>

        {/* NAV */}
        <div className="flex gap-5 text-gray-700">
          {[
            "Home",
            "About",
            "Skills",
            "Experience",
            "Projects",
            "Education",
          ].map((s) => (
            <Motion.button
              key={s}
              onClick={() => scrollTo(s.toLowerCase())}
              whileHover={hover}
              whileTap={tap}
              className="hover:text-blue-600"
            >
              {s}
            </Motion.button>
          ))}
        </div>

        {/* SOCIAL */}
        <div className="flex gap-4">
          {[
            { icon: Github, link: footer.github },
            { icon: Linkedin, link: footer.linkedin },
            { icon: Mail, link: `mailto:${footer.email}` },
          ].map(({ icon: Icon, link }, i) => (
            <Motion.a
              key={i}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={hover}
              whileTap={tap}
              className="text-gray-700 hover:text-blue-600"
              aria-label="Social link"
            >
              <Icon size={22} />
            </Motion.a>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-gray-600 mt-8">
        © {new Date().getFullYear()} Bhupendra Saini. All Rights Reserved.
      </p>
    </Motion.footer>
  );
};

export default Footer;
