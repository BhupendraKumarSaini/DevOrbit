import React, { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Pencil, Github, Linkedin, Mail, X } from "lucide-react";
import Skeleton from "../component/ui/Skeleton";
import { fadeUp, scaleIn, hover, tap } from "../animation/motion";

const API = import.meta.env.VITE_API_URL;

const EditFooter = () => {
  const [footer, setFooter] = useState(null);
  const [editModal, setEditModal] = useState(false);

  const [form, setForm] = useState({
    github: "",
    linkedin: "",
    email: "",
    resume: null,
    oldResume: "",
  });

  /* LOAD */
  const loadFooter = async () => {
    try {
      const res = await fetch(`${API}/api/footer`);
      const data = await res.json();
      setFooter(data);
      setForm({
        github: data.github || "",
        linkedin: data.linkedin || "",
        email: data.email || "",
        resume: null,
        oldResume: data.resume || "",
      });
    } catch (err) {
      console.error("Failed to load footer:", err);
    }
  };

  useEffect(() => {
    loadFooter();
  }, []);

  /* SAVE */
  const saveFooter = async () => {
    const fd = new FormData();
    fd.append("github", form.github);
    fd.append("linkedin", form.linkedin);
    fd.append("email", form.email);
    if (form.resume) fd.append("resume", form.resume);

    await fetch(`${API}/api/footer`, {
      method: "PUT",
      body: fd,
    });

    setEditModal(false);
    loadFooter();
  };

  /* LOADING */
  if (!footer) {
    return (
      <section className="pt-40 flex justify-center">
        <Skeleton className="h-32 w-96 rounded-2xl" />
      </section>
    );
  }

  return (
    <>
      <section className="pt-40 flex justify-center font-[Poppins]">
        <Motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="relative bg-white/90 backdrop-blur-lg rounded-2xl p-10 shadow-xl text-center min-w-[320px] border"
        >
          {/* EDIT */}
          <Motion.button
            whileHover={hover}
            whileTap={tap}
            onClick={() => setEditModal(true)}
            className="absolute top-3 right-3 bg-gray-900 text-white p-2 rounded-full"
          >
            <Pencil size={16} />
          </Motion.button>

          {/* RESUME */}
          {footer.resume && (
            <p className="text-blue-600 font-medium mb-6">Resume uploaded</p>
          )}

          {/* SOCIALS */}
          <div className="flex gap-6 justify-center text-gray-700">
            <Motion.div whileHover={hover}>
              <Github />
            </Motion.div>
            <Motion.div whileHover={hover}>
              <Linkedin />
            </Motion.div>
            <Motion.div whileHover={hover}>
              <Mail />
            </Motion.div>
          </div>
        </Motion.div>
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {editModal && (
          <Modal onClose={() => setEditModal(false)}>
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Edit Footer</h2>
                <button onClick={() => setEditModal(false)}>
                  <X />
                </button>
              </div>

              <Input
                label="GitHub URL"
                value={form.github}
                set={(v) => setForm({ ...form, github: v })}
              />

              <Input
                label="LinkedIn URL"
                value={form.linkedin}
                set={(v) => setForm({ ...form, linkedin: v })}
              />

              <Input
                label="Email Address"
                value={form.email}
                set={(v) => setForm({ ...form, email: v })}
              />

              {/* RESUME */}
              <div className="space-y-1">
                <label className="block font-medium">Resume (PDF)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    setForm({ ...form, resume: e.target.files?.[0] })
                  }
                />
                {form.oldResume && !form.resume && (
                  <p className="text-sm text-gray-500">
                    Current: {form.oldResume}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button onClick={() => setEditModal(false)}>Cancel</button>
                <button
                  onClick={saveFooter}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                >
                  Save
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

/* Helpers */
const Modal = ({ children, onClose }) => (
  <Motion.div
    className="fixed inset-0 bg-black/40 backdrop-blur-sm
      flex justify-center items-center z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <Motion.div
      variants={scaleIn}
      initial="hidden"
      animate="show"
      exit="hidden"
      onClick={(e) => e.stopPropagation()}
      className="bg-white rounded-2xl p-6 w-[90%] max-w-md"
    >
      {children}
    </Motion.div>
  </Motion.div>
);

const Input = ({ label, value, set }) => (
  <div>
    <label className="block mb-1 font-medium">{label}</label>
    <input
      className="w-full border p-3 rounded-lg"
      value={value}
      onChange={(e) => set(e.target.value)}
    />
  </div>
);

export default EditFooter;
