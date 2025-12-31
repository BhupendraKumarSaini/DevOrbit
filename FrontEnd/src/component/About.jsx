import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import Skeleton from "./ui/Skeleton";
import { fadeUp, stagger } from "../animation/motion";

const API = import.meta.env.VITE_API_URL;

const About = () => {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/about`)
      .then((r) => r.json())
      .then(setAbout)
      .catch(() => {});
  }, []);

  /* LOADING */
  if (!about) {
    return (
      <section className="pt-24 flex justify-center">
        <Skeleton className="w-96 h-64 rounded-2xl" />
      </section>
    );
  }

  return (
    <section
      id="about"
      className="pt-20 w-[95%] sm:w-[85%] md:w-[80%] lg:w-[70%] mx-auto font-[Poppins]"
    >
      {/* TITLE */}
      <Motion.h1
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="text-center text-4xl sm:text-5xl font-semibold mb-8"
      >
        About <span className="text-blue-700">Me</span>
      </Motion.h1>

      {/* CONTENT */}
      <Motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="grid md:grid-cols-2 gap-12 items-center"
      >
        {/* IMAGE */}
        <Motion.img
          variants={fadeUp}
          src={`${API}/uploads/${about.image}`}
          alt="About"
          className="rounded-2xl shadow-xl w-full max-w-sm mx-auto"
        />

        {/* TEXT */}
        <Motion.div
          variants={fadeUp}
          className="text-gray-700 text-lg space-y-4 text-center md:text-left"
        >
          {about.description
            .split(/\n+/)
            .filter(Boolean)
            .map((p, i) => (
              <p key={i}>{p}</p>
            ))}
        </Motion.div>
      </Motion.div>
    </section>
  );
};

export default About;
