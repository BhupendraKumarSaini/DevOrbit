import React, { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Edit, X } from "lucide-react";
import Skeleton from "../component/ui/Skeleton";
import { fadeUp, scaleIn, hover, tap } from "../animation/motion";

const API = import.meta.env.VITE_API_URL;

const EditAbout = () => {
  const [about, setAbout] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [form, setForm] = useState({
    description: "",
    image: null,
  });

  /* LOAD */
  const loadAbout = async () => {
    try {
      const res = await fetch(`${API}/api/about`);
      const data = await res.json();
      setAbout(data);
      setForm({
        description: data?.description || "",
        image: null,
      });
    } catch (err) {
      console.error("Failed to load about:", err);
    }
  };

  useEffect(() => {
    loadAbout();
  }, []);

  /* SAVE */
  const saveAbout = async () => {
    const fd = new FormData();
    fd.append("description", form.description);
    if (form.image) fd.append("image", form.image);

    try {
      await fetch(`${API}/api/about`, { method: "PUT", body: fd });
      setOpenModal(false);
      loadAbout();
    } catch (err) {
      console.error("Failed to save about:", err);
    }
  };

  /* LOADING */
  if (!about) {
    return (
      <section className="pt-32 w-[90%] mx-auto">
        <Skeleton className="h-10 w-48 mx-auto mb-10" />
        <Skeleton className="w-72 h-80 rounded-2xl mx-auto" />
      </section>
    );
  }

  return (
    <>
      {/* PREVIEW */}
      <section
        className="h-[calc(100vh-8rem)] w-[95%] md:w-[80%] mx-auto font-[Poppins] relative overflow-hidden"
      >
        {/* EDIT */}
        <Motion.button
          onClick={() => setOpenModal(true)}
          whileHover={hover}
          whileTap={tap}
          className="absolute right-1 top-1 bg-gray-900 text-white p-3 rounded-full shadow"
        >
          <Edit size={18} />
        </Motion.button>

        <Motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-center text-4xl font-semibold"
        >
          About <span className="text-blue-600">Me</span>
        </Motion.h1>

        <div className="grid md:grid-cols-2 gap-12 items-center h-full">
          <Motion.img
            variants={fadeUp}
            initial="hidden"
            animate="show"
            src={`${API}/uploads/${about.image}`}
            alt="About"
            className="rounded-2xl shadow-xl w-72 max-h-full object-contain mx-auto"
          />

          <Motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.1 }}
            className="text-gray-700 text-lg leading-relaxed"
          >
            {about.description}
          </Motion.p>
        </div>
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {openModal && (
          <Motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenModal(false)}
          >
            <Motion.div
              variants={scaleIn}
              initial="hidden"
              animate="show"
              exit="hidden"
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-[90%] max-w-xl space-y-4 relative"
            >
              <button
                onClick={() => setOpenModal(false)}
                className="absolute top-4 right-4"
              >
                <X />
              </button>

              <h2 className="text-xl font-semibold text-center">
                Edit About Section
              </h2>

              <textarea
                rows={6}
                className="w-full border p-3 rounded-lg"
                placeholder="About description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, image: e.target.files?.[0] || null })
                }
              />

              <div className="flex justify-end gap-4 pt-2">
                <Motion.button
                  whileHover={hover}
                  whileTap={tap}
                  onClick={() => setOpenModal(false)}
                  className="px-6 py-3 border rounded-xl"
                >
                  Cancel
                </Motion.button>

                <Motion.button
                  whileHover={hover}
                  whileTap={tap}
                  onClick={saveAbout}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl"
                >
                  Save
                </Motion.button>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EditAbout;
