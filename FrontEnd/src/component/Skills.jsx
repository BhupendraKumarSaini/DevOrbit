import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import Skeleton from "./ui/Skeleton";
import toast from "react-hot-toast";
import { fadeUp, scaleIn, stagger, hover, tap } from "../animation/motion";
import { apiFetch } from "../lib/api";

const API = import.meta.env.VITE_API_URL;

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/skills")
      .then(setSkills)
      .catch(() => toast.error("Failed to load skills"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="pt-24">
        <Skeleton className="h-10 w-40 mx-auto" />
      </section>
    );
  }

  const grouped = skills.reduce((acc, s) => {
    acc[s.category] = acc[s.category] || [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <section
      id="skills"
      className="pt-25 mb-24 w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto font-[Poppins]"
    >
      <Motion.h1
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        className="text-center text-4xl sm:text-5xl font-semibold mb-10"
      >
        Skills
      </Motion.h1>

      {Object.entries(grouped).map(([category, list]) => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-semibold mb-3">{category}</h2>

          <Motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
          >
            {list.map((skill) => (
              <Motion.div
                key={skill._id}
                variants={scaleIn}
                whileHover={hover}
                whileTap={tap}
                className="border border-gray-200 rounded-2xl bg-white/80 py-6 flex flex-col items-center shadow"
              >
                <img
                  src={`${API}/uploads/skills/${skill.icon}`}
                  className="w-12 mb-3 p-3 border rounded-xl"
                  style={{
                    filter: `drop-shadow(0 0 6px ${skill.color})`,
                  }}
                />
                <p className="font-medium">{skill.name}</p>
              </Motion.div>
            ))}
          </Motion.div>
        </div>
      ))}
    </section>
  );
};

export default Skills;
