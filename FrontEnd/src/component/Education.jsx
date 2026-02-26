import React from "react";
import { motion as Motion } from "framer-motion";
import { fadeUp, stagger, scaleIn, hover, tap } from "../animation/motion";

const EducationCertifications = ({ education, certifications }) => {
  return (
    <section
      id="education"
      className="pt-20 mb-24 w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto font-[Poppins]"
    >
      <Motion.h1
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="text-center text-4xl sm:text-5xl font-semibold mb-12"
      >
        Education & <span className="text-blue-600">Certifications</span>
      </Motion.h1>

      <Motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="grid md:grid-cols-2 gap-12"
      >
        {/* EDUCATION */}
        <Motion.div variants={scaleIn}>
          <h2 className="text-2xl font-semibold mb-6">🎓 Education</h2>

          <div className="space-y-6">
            {education.map((e) => (
              <Motion.div
                whileHover={hover}
                whileTap={tap}
                key={e._id}
                className="bg-white/80 border border-gray-200 rounded-2xl p-6 shadow"
              >
                <h3 className="text-lg font-semibold">{e.degree}</h3>
                <p className="text-gray-700">
                  {e.institute} – {e.location}
                </p>
                <p className="text-gray-600 text-sm">
                  {e.startYear} – {e.endYear}
                  {e.grade && ` | ${e.grade}`}
                </p>
              </Motion.div>
            ))}

            {education.length === 0 && (
              <p className="text-gray-500">No education added.</p>
            )}
          </div>
        </Motion.div>

        {/* CERTIFICATIONS */}
        <Motion.div variants={scaleIn}>
          <h2 className="text-2xl font-semibold mb-6">📜 Certifications</h2>

          <div className="space-y-6">
            {certifications.map((c) => (
              <Motion.div
                whileHover={hover}
                whileTap={tap}
                key={c._id}
                className="bg-white/80 border  border-gray-200 rounded-2xl p-6 shadow"
              >
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <p className="text-gray-700">{c.issuer}</p>
                <p className="text-gray-700">{c.year}</p>
              </Motion.div>
            ))}

            {certifications.length === 0 && (
              <p className="text-gray-500">No certifications added.</p>
            )}
          </div>
        </Motion.div>
      </Motion.div>
    </section>
  );
};

export default EducationCertifications;
