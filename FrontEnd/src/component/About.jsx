import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";

const API = import.meta.env.VITE_API_URL;

const About = () => {
  const [isDesktop, setIsDesktop] = useState(true);
  const [about, setAbout] = useState(null);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* FETCH ABOUT FROM DB */
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch(`${API}/api/about`);
        const data = await res.json();
        setAbout(data);
      } catch (err) {
        console.log("Failed to load About section", err);
      }
    };

    fetchAbout();
  }, []);

  if (!about) return <p className="text-center mt-20">Loading...</p>;

  return (
    <>
      <section
        id="about"
        className="pt-21 w-[95%] sm:w-[85%] md:w-[80%] lg:w-[70%] mx-auto font-[Poppins]"
      >
        {/* Title */}
        <Motion.h1
          initial={{ y: -40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center text-3xl sm:text-4xl md:text-5xl font-semibold text-black mb-7"
        >
          About <span className="text-blue-700">Me</span>
        </Motion.h1>

        <div className="flex flex-col md:flex-row items-center md:items-center gap-8 sm:gap-10 md:gap-16 mt-12">
          {/* LEFT IMAGE */}
          <Motion.div
            initial={
              isDesktop ? { x: -60, opacity: 0 } : { opacity: 0, scale: 0.9 }
            }
            whileInView={{ x: 0, opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center justify-center md:justify-start w-full md:w-1/3"
          >
            <img
              src={`${API}/uploads/${about.image}`}
              alt="About"
              className="
                rounded-2xl shadow-[0_8px_10px_rgba(0,0,0,0.2)]
                w-44 sm:w-56 md:w-72 lg:w-80
                object-cover my-4 md:my-0
              "
            />
          </Motion.div>

          {/* RIGHT TEXT */}
          <Motion.div
            initial={isDesktop ? { x: 60, opacity: 0 } : { opacity: 0, y: 40 }}
            whileInView={{ x: 0, y: 0, opacity: 1 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-xl text-gray-700 leading-relaxed text-center md:text-left max-w-xl md:max-w-2xl mx-auto md:mx-0 my-4 space-y-4 md:pl-6 md:w-2/3"
          >
            {about.description.split("\n").map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </Motion.div>
        </div>
      </section>
    </>
  );
};

export default About;
