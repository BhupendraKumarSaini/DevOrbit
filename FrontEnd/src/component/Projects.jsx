import React, { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import Skeleton from "./ui/Skeleton";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { fadeUp, stagger, hover, tap } from "../animation/motion";
import { X } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const Projects = () => {
  const [projects, setProjects] = useState(null);
  const [active, setActive] = useState(null);

  useEffect(() => {
    apiFetch("/api/projects").then((data) => {
      const clean = (data || [])
        .filter((p) => p && p._id && p.title && p.thumbnail)
        .reverse();

      setProjects(clean);
    });
  }, []);

  if (!projects) {
    return (
      <section className="pt-24">
        <Skeleton className="h-64 w-[70%] mx-auto" />
      </section>
    );
  }

  return (
    <section
      id="projects"
      className="pt-25 w-[92%] lg:w-[78%] mx-auto font-[Poppins]"
    >
      {/* Heading */}
      <Motion.h1
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        className="text-center text-4xl font-semibold mb-11"
      >
        Projects
      </Motion.h1>

      {/* Cards Grid */}
      <Motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        className="grid sm:grid-cols-1 lg:grid-cols-2 gap-10"
      >
        {projects.map((p) => (
          <Motion.div
            key={p._id}
            variants={fadeUp}
            whileHover={{ y: -6 }}
            onClick={() => setActive(p)}
            className="cursor-pointer bg-white rounded-2xl overflow-hidden shadow-[0_12px_35px_rgba(0,0,0,0.14)]hover:shadow-[0_22px_55px_rgba(0,0,0,0.2)] transition"
          >
            {/* Thumbnail*/}
            <img
              src={`${API}/uploads/projects/${p.thumbnail}`}
              alt={p.title}
              className="w-full object-cover object-top"
            />

            {/* Content */}
            <div className="p-7 flex flex-col gap-4">
              <div>
                <h3 className="text-xl font-semibold leading-tight">
                  {p.title}
                </h3>

                <p className="text-gray-600 mt-2 text-sm leading-relaxed line-clamp-2">
                  {p.summary}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-2">
                {p.liveLink && (
                  <Motion.a
                    whileHover={hover}
                    whileTap={tap}
                    href={p.liveLink}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-1.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Live
                  </Motion.a>
                )}

                {p.githubLink && (
                  <Motion.a
                    whileHover={hover}
                    whileTap={tap}
                    href={p.githubLink}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-1.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    GitHub
                  </Motion.a>
                )}
              </div>
            </div>
          </Motion.div>
        ))}
      </Motion.div>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {active && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4"
          >
            <Motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className=" bg-white rounded-2xlmax-w-3xl w-full max-h-[97vh] overflow-y-auto relative"
            >
              {/* HEADER IMAGE */}
              <div className="relative">
                <img
                  src={`${API}/uploads/projects/${active.thumbnail}`}
                  alt={active.title}
                  className="w-full object-cover object-top"
                />

                {/* CLOSE */}
                <Motion.button
                  whileHover={hover}
                  onClick={() => setActive(null)}
                  className="absolute top-2 right-2 cursor-pointer
            
            "
                >
                  <X size={25} />
                </Motion.button>
              </div>

              {/* CONTENT */}
              <div className="p-8">
                {/* Title */}
                <h2 className="text-3xl font-semibold">{active.title}</h2>

                {/* Summary */}
                <p className="text-gray-600 mt-3 leading-relaxed">
                  {active.summary}
                </p>

                {/* Divider */}
                <div className="h-px bg-gray-200 my-6" />

                {/* Description */}
                <ul className="list-disc ml-5 space-y-2 text-gray-700">
                  {active.points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>

                {/* Tech */}
                <p className="mt-6 text-sm text-gray-700">
                  <strong>Tech:</strong> {active.techStack.join(", ")}
                </p>

                {/* ACTIONS */}
                <div className="flex gap-4 mt-8">
                  {active.liveLink && (
                    <Motion.a
                      whileHover={hover}
                      whileTap={tap}
                      href={active.liveLink}
                      target="_blank"
                      className="px-6 py-2 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Live
                    </Motion.a>
                  )}

                  {active.githubLink && (
                    <Motion.a
                      whileHover={hover}
                      whileTap={tap}
                      href={active.githubLink}
                      target="_blank"
                      className="px-6 py-2 rounded-xl text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      GitHub
                    </Motion.a>
                  )}
                </div>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
