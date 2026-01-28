import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import Skeleton from "./ui/Skeleton";
import toast from "react-hot-toast";
import { fadeUp, fadeDown, stagger, hover, tap } from "../animation/motion";
import { apiFetch } from "../lib/api";

const API = import.meta.env.VITE_API_URL;

const Hero = () => {
  const [hero, setHero] = useState(null);
  const [resume, setResume] = useState("");

  useEffect(() => {
    apiFetch("/api/hero")
      .then(setHero)
      .catch(() => toast.error("Failed to load profile"));
  }, []);

  useEffect(() => {
    apiFetch("/api/footer").then((d) => setResume(d?.resume || ""));
  }, []);

  const downloadResume = async () => {
    if (!resume) return toast.error("Resume not available");

    const id = toast.loading("Downloading resume...");
    try {
      const res = await fetch(`${API}/uploads/resume/${resume}`);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = resume.replace(/^\d+-/, "");
      link.click();
      toast.success("Downloaded", { id });
    } catch {
      toast.error("Download failed", { id });
    }
  };

  if (!hero) {
    return (
      <section
        id="home"
        className="min-h-screen flex justify-center items-center"
      >
        <Skeleton className="w-80 h-80 rounded-2xl" />
      </section>
    );
  }

  return (
    <section
      id="home"
      className="min-h-screen w-[95%] sm:w-[85%] md:w-[80%] lg:w-[70%] mx-auto grid md:grid-cols-2 gap-14 items-center pt-24 font-[Poppins]"
    >
      {/* TEXT */}
      <Motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="text-center md:text-left space-y-5"
      >
        <Motion.h1
          variants={fadeDown}
          className="text-4xl sm:text-5xl font-semibold"
        >
          {hero.name}
        </Motion.h1>

        <Motion.p
          variants={fadeUp}
          className="text-2xl text-blue-600 font-semibold"
        >
          {hero.role}
        </Motion.p>

        <Motion.p variants={fadeUp} className="text-gray-700 max-w-lg">
          {hero.headline}
        </Motion.p>

        <Motion.div
          variants={fadeUp}
          className="flex gap-4 justify-center md:justify-start"
        >
          <Motion.button
            whileHover={hover}
            whileTap={tap}
            onClick={() =>
              document
                .getElementById("projects")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-blue-600 px-6 py-4 rounded-2xl text-white"
          >
            View Projects
          </Motion.button>

          <Motion.button
            whileHover={hover}
            whileTap={tap}
            onClick={downloadResume}
            className="bg-gray-900 px-6 py-4 rounded-2xl text-white"
          >
            Download Resume
          </Motion.button>
        </Motion.div>
      </Motion.div>

      {/* IMAGE */}
      <Motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="flex justify-center"
      >
        <img
          src={`${API}/uploads/hero/${hero.profileImage}`}
          alt={hero.name}
          className="w-[300px] rounded-2xl shadow-xl"
        />
      </Motion.div>
    </section>
  );
};

export default Hero;
