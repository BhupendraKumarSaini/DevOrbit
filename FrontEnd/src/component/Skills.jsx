import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import Skeleton from "./ui/Skeleton";
import toast from "react-hot-toast";
import { fadeUp, scaleIn, stagger, hover, tap } from "../animation/motion";

const API = import.meta.env.VITE_API_URL;

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/skills`)
      .then((r) => r.json())
      .then(setSkills)
      .catch(() => toast.error("Failed to load skills"))
      .finally(() => setLoading(false));
  }, []);

  /* LOADING */
  if (loading) {
    return (
      <section className="pt-24 mb-24 w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto">
        <Skeleton className="h-10 w-40 mx-auto mb-12" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id="skills"
      className="pt-20 mb-24 w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto font-[Poppins]"
    >
      {/* TITLE */}
      <Motion.h1
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="text-center text-4xl sm:text-5xl font-semibold mb-8"
      >
        Skills
      </Motion.h1>

      {/* GRID */}
      <Motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
      >
        {skills.map((skill) => (
          <Motion.div
            key={skill._id}
            variants={scaleIn}
            whileHover={hover}
            whileTap={tap}
            className="border border-gray-200 rounded-2xl bg-white/80 py-6 flex flex-col items-center justify-center cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_14px_30px_rgba(0,0,0,0.18)] transition-shadow"
          >
            <img
              src={`${API}/uploads/${skill.icon}`}
              alt={skill.name}
              className="w-12 mb-3 p-3 border border-gray-200 rounded-xl"
              style={{ filter: `drop-shadow(0 0 6px ${skill.color})` }}
            />
            <p className="text-gray-700 text-lg font-medium">{skill.name}</p>
          </Motion.div>
        ))}
      </Motion.div>
    </section>
  );
};

export default Skills;
