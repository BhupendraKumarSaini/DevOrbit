import React, { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";

const API = import.meta.env.VITE_API_URL;

const Projects = () => {
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);

  /* FETCH PROJECTS FROM DB */
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch(`${API}/api/projects`);
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.log("Failed to fetch projects:", err);
      }
    };

    loadProjects();
  }, []);

  return (
    <>
      <section
        id="projects"
        className="pt-20 w-[95%] sm:w-[85%] md:w-[80%] lg:w-[70%] mx-auto font-[Poppins]"
      >
        <Motion.h1
          initial={{ y: -40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center text-5xl font-semibold text-black mb-10"
        >
          Projects
        </Motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 hover:cursor-pointer">
          {projects.map((project, index) => (
            <Motion.div
              key={project._id}
              onClick={() => {
                setSelectedProject(project);
                setOpen(true);
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.1, delay: index * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="border border-gray-200 p-5 rounded-2xl text-gray-700 shadow-[0_2px_10px_rgba(0,0,0,0.2)] bg-white/80 hover:shadow-[0_12px_35px_rgba(0,0,0,0.15)] transition-all"
            >
              <img
                src={`${API}/uploads/projects/${project.thumbnail}`}
                className="mb-4 rounded-xl p-1 w-full object-contain max-h-60"
              />

              <p className="text-xl text-black font-semibold mb-0">
                {project.title}
              </p>

              <p className="line-clamp-2 mb-3">{project.description}</p>

              <Motion.a
                href={project.link}
                target="_blank"
                onClick={(e) => e.stopPropagation()}
                className="bg-blue-600 py-2 px-5 rounded-lg text-white hover:bg-blue-700 shadow-[0_4px_6px_rgba(0,0,0,0.3)] inline-block"
                whileHover={{ scale: 1.07, opacity: 0.9 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              >
                Visit Site
              </Motion.a>
            </Motion.div>
          ))}
        </div>
      </section>

      {/* POPUP */}
      <AnimatePresence>
        {open && selectedProject && (
          <Motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-5 font-[Poppins]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <Motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-2xl p-6 w-[90%] sm:w-[500px] md:w-[650px] max-h-[95vh] sm:max-h-[96vh] md:max-h-[99vh] overflow-y-auto md:overflow-visible scrollbar-none"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-xl hover:cursor-pointer"
                onClick={() => setOpen(false)}
              >
                ✖
              </button>

              <img
                src={`${API}/uploads/projects/${selectedProject.thumbnail}`}
                alt={selectedProject.title}
                className="w-full rounded-xl mb-5 object-contain max-h-[350px]"
              />

              <h3 className="text-3xl font-semibold text-gray-900">
                {selectedProject.title}
              </h3>

              <p className="mt-3 text-gray-700 leading-relaxed">
                {selectedProject.description}
              </p>

              <Motion.a
                href={selectedProject.link}
                target="_blank"
                className="mt-4 inline-block px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-[0_4px_6px_rgba(0,0,0,0.3)]"
                whileHover={{ scale: 1.07, opacity: 0.9 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
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
