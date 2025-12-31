import React, { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import Skeleton from "./ui/Skeleton";
import toast from "react-hot-toast";
import { fadeUp, scaleIn, stagger, hover, tap } from "../animation/motion";

const API = import.meta.env.VITE_API_URL;

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/projects`)
      .then((r) => r.json())
      .then(setProjects)
      .catch(() => toast.error("Failed to load projects"))
      .finally(() => setLoading(false));
  }, []);

  /* LOADING */
  if (loading) {
    return (
      <section className="pt-24 mb-24 w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto">
        <Skeleton className="h-12 w-40 mx-auto mb-12" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        id="projects"
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
          Projects
        </Motion.h1>

        {/* GRID */}
        <Motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-7"
        >
          {projects.map((project) => (
            <Motion.div
              key={project._id}
              variants={scaleIn}
              whileHover={hover}
              whileTap={tap}
              onClick={() => setSelectedProject(project)}
              className="border border-gray-200 rounded-2xl p-5 bg-white/80 cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_14px_30px_rgba(0,0,0,0.18)] transition-shadow"
            >
              <img
                src={`${API}/uploads/projects/${project.thumbnail}`}
                alt={project.title}
                className="rounded-xl mb-4 w-full object-contain max-h-60"
              />

              <h3 className="text-xl font-semibold mb-1">{project.title}</h3>

              <p className="text-gray-600 line-clamp-2 mb-4">
                {project.description}
              </p>

              <Motion.a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                whileHover={hover}
                whileTap={tap}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl"
              >
                Visit Site
              </Motion.a>
            </Motion.div>
          ))}
        </Motion.div>
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <Motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-5 font-[Poppins]"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            exit="hidden"
            onClick={() => setSelectedProject(null)}
          >
            <Motion.div
              variants={scaleIn}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 text-xl"
                aria-label="Close"
              >
                ✖
              </button>

              <img
                src={`${API}/uploads/projects/${selectedProject.thumbnail}`}
                alt={selectedProject.title}
                className="rounded-xl mb-4 w-full object-contain max-h-72"
              />

              <h2 className="text-2xl font-semibold mb-2">
                {selectedProject.title}
              </h2>

              <p className="text-gray-700 mb-4">
                {selectedProject.description}
              </p>

              <Motion.a
                href={selectedProject.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={hover}
                whileTap={tap}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-7 py-2 rounded-xl"
              >
                Visit Site
              </Motion.a>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Projects;
