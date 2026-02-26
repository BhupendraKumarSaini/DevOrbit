import React from "react";
import { motion as Motion } from "framer-motion";
import { fadeUp, stagger } from "../animation/motion";

const About = ({ about }) => {
  return (
    <section
      id="about"
      className="pt-20 w-[95%] sm:w-[85%] md:w-[80%] lg:w-[70%] mx-auto font-[Poppins]"
    >
      <Motion.h1
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="text-center text-4xl sm:text-5xl font-semibold mb-8 mt-4"
      >
        Professional <span className="text-blue-700">Summary</span>
      </Motion.h1>

      <Motion.ul
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="max-w-3xl mx-auto space-y-4 text-gray-700 text-lg list-disc list-inside"
      >
        {about?.points?.map((p, i) => (
          <Motion.li key={i} variants={fadeUp}>
            {p}
          </Motion.li>
        ))}
      </Motion.ul>
    </section>
  );
};

export default About;
