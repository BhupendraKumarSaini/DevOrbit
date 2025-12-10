import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";

const API = import.meta.env.VITE_API_URL;

const Skills = () => {
  const [skills, setSkills] = useState([]);

  /* Fetch skills from DB */
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const res = await fetch(`${API}/api/skills`);
        const data = await res.json();
        setSkills(data);
      } catch (err) {
        console.log("Failed to fetch skills:", err);
      }
    };

    loadSkills();
  }, []);

  return (
    <>
      <section
        id="skills"
        className="pt-22 w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto font-[Poppins]"
      >
        {/* Title */}
        <Motion.h1
          initial={{ y: -40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center text-4xl sm:text-5xl font-semibold text-black mb-10 sm:mb-12"
        >
          Skills
        </Motion.h1>

        {/* Skills Grid */}
        <Motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={{ hidden: {}, visible: {} }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8"
        >
          {skills.map((skill, i) => (
            <Motion.div
              key={skill._id}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              whileHover={{ y: -6, scale: 1.03 }}
              transition={{ delay: i * 0, duration: 0 }}
              className="border border-gray-200 py-6 sm:py-7 md:py-8 px-3 sm:px-4 rounded-2xl flex flex-col items-center justify-center 
                text-center text-base sm:text-lg md:text-xl text-gray-700 shadow-[0_2px_10px_rgba(0,0,0,0.2)] bg-white/80 cursor-pointer hover:shadow-[0_10px_20px_rgba(0,0,0,0.15)] transition-all"
            >
              <img
                src={`${API}/uploads/${skill.icon}`}
                className="w-10 sm:w-12 md:w-14 mb-2 border border-gray-200 rounded-xl p-2 sm:p-3"
                style={{ filter: `drop-shadow(0 0 5px ${skill.color})` }}
              />

              <p className="mt-1 sm:mt-2">{skill.name}</p>
            </Motion.div>
          ))}
        </Motion.div>
      </section>
    </>
  );
};

export default Skills;
