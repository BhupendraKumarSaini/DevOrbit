import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";

const API = import.meta.env.VITE_API_URL;

const Hero = () => {
  const [isDesktop, setIsDesktop] = useState(true);
  const [hero, setHero] = useState(null);
  const [resume, setResume] = useState("");

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* FETCH HERO FROM DB */
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch(`${API}/api/hero`);
        const data = await res.json();
        setHero(data);
      } catch (err) {
        console.log("Failed to fetch hero:", err);
      }
    };

    fetchHero();
  }, []);

  /* FETCH RESUME FROM DB */
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

  /* DOWNLOAD RESUME */
  const handleDownloadResume = async () => {
    if (!resume) return;

    try {
      const fileUrl = `${API}/uploads/resume/${resume}`;
      const res = await fetch(fileUrl);
      const blob = await res.blob();

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);

      const cleanName = resume.replace(/^\d+-/, "");

      link.download = cleanName;
      link.click();
    } catch (err) {
      console.log("Resume download failed:", err);
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      if (window.innerWidth < 768) {
        element.scrollIntoView({ behavior: "auto", block: "start" });
      } else {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  if (!hero) return <p className="text-center mt-20">Loading...</p>;

  return (
    <>
      <section
        id="home"
        className="min-h-screen w-[95%] sm:w-[85%] md:w-[80%] lg:w-[70%] mx-auto flex flex-col-reverse md:grid md:grid-cols-2 items-center gap-10 sm:gap-14 md:gap-16 pt-24 font-[Poppins]"
      >
        {/* LEFT CONTENT */}
        <Motion.div
          initial={isDesktop ? { x: -60, opacity: 0 } : { opacity: 0, y: 40 }}
          whileInView={{ x: 0, y: 0, opacity: 1 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center md:text-left flex flex-col justify-center max-w-[95%] sm:max-w-[80%] md:max-w-full mx-auto md:mx-0"
        >
          <h1 className="text-4xl sm:text-5xl font-semibold text-black leading-snug">
            Hi, I'm <span className="text-blue-700">{hero.name} 👋</span>
          </h1>

          <p className="text-3xl sm:text-4xl font-semibold text-blue-600 mt-3">
            {hero.title}
          </p>

          <p className="mt-5 text-gray-700 text-lg leading-relaxed max-w-xl md:max-w-lg mx-auto md:mx-0">
            {hero.description}
          </p>

          {/* BUTTONS */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center md:justify-start">
            <Motion.a
              onClick={() => scrollToSection("projects")}
              className="bg-blue-600 py-4 px-6 rounded-2xl text-white shadow-[0_8px_10px_rgba(0,0,0,0.2)] hover:cursor-pointer hover:bg-blue-700"
              whileHover={{ scale: 1.07, opacity: 0.9 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              View Projects
            </Motion.a>

            <Motion.button
              onClick={handleDownloadResume}
              className="bg-gray-900 py-4 px-6 rounded-2xl text-white shadow-[0_8px_10px_rgba(0,0,0,0.3)] hover:bg-black"
              whileHover={{ scale: 1.07, opacity: 0.9 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              Download Resume
            </Motion.button>
          </div>
        </Motion.div>

        {/* RIGHT IMAGE */}
        <Motion.div
          initial={
            isDesktop ? { x: 60, opacity: 0 } : { opacity: 0, scale: 0.85 }
          }
          whileInView={{ x: 0, opacity: 1, scale: 1 }}
          viewport={{ amount: 0.4, once: false }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center md:justify-end w-full"
        >
          <div className="rounded-2xl overflow-hidden shadow-xl backdrop-blur-lg bg-white/20 border border-white/30 w-60 xs:w-[260px] sm:w-[290px] md:w-[330px] lg:w-[310px]">
            <img
              src={`${API}/uploads/${hero.image}`}
              alt="Hero"
              className="w-full object-cover"
            />
          </div>
        </Motion.div>
      </section>
    </>
  );
};

export default Hero;
