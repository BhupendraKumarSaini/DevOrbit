import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { fadeUp } from "../animation/motion";
import { apiFetch } from "../lib/api";

const Experience = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    apiFetch("/api/experience").then(setData);
  }, []);

  return (
    <section
      id="experience"
      className="pt-25 mb-24 w-[80%] mx-auto font-[Poppins]"
    >
      <Motion.h1
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        className="text-center text-4xl font-semibold mb-10"
      >
        Work <span className="text-blue-700">Experience</span>
      </Motion.h1>

      <div className="space-y-10">
        {data.map((e) => (
          <Motion.div
            key={e._id}
            variants={fadeUp}
            className="border-l-4 border-blue-600 pl-6"
          >
            <h3 className="text-xl font-semibold">
              {e.role} — {e.company}
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              {e.startDate} – {e.endDate}
              {e.location && ` | ${e.location}`}
            </p>

            <ul className="list-disc ml-5 space-y-1 text-gray-700">
              {e.points.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </Motion.div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
