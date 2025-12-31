import React, { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Edit, X } from "lucide-react";
import Skeleton from "../component/ui/Skeleton";
import { fadeUp, scaleIn, hover, tap } from "../animation/motion";

const API = import.meta.env.VITE_API_URL;

const EditHero = () => {
  const [hero, setHero] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    title: "",
    description: "",
    image: null,
  });

  /* LOAD HERO */
  const loadHero = async () => {
    try {
      const res = await fetch(`${API}/api/hero`);
      const data = await res.json();
      setHero(data);
      setForm({
        name: data?.name || "",
        title: data?.title || "",
        description: data?.description || "",
        image: null,
      });
    } catch (err) {
      console.error("Failed to load hero:", err);
    }
  };

  useEffect(() => {
    loadHero();
  }, []);

  /* SAVE */
  const saveHero = async () => {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("title", form.title);
    fd.append("description", form.description);
    if (form.image) fd.append("image", form.image);

    try {
      await fetch(`${API}/api/hero`, { method: "PUT", body: fd });
      setOpenModal(false);
      loadHero();
    } catch (err) {
      console.error("Failed to save hero:", err);
    }
  };

  /* LOADING */
  if (!hero) {
    return (
      <section className="pt-32 w-[90%] mx-auto">
        <Skeleton className="h-10 w-48 mb-6" />
        <Skeleton className="h-6 w-64 mb-4" />
        <Skeleton className="h-4 w-full max-w-xl mb-2" />
        <Skeleton className="h-80 w-64 rounded-2xl" />
      </section>
    );
  }

  return (
    <>
      {/* PREVIEW */}
      <section className="h-[calc(100vh-8rem)] overflow-hidden w-[95%] md:w-[80%] mx-auto grid md:grid-cols-2 gap-12 font-[Poppins] relative">
        {/* EDIT BUTTON */}
        <Motion.button
          onClick={() => setOpenModal(true)}
          whileHover={hover}
          whileTap={tap}
          className="absolute right-1 top-1 bg-gray-900 text-white p-3 rounded-full shadow"
        >
          <Edit size={18} />
        </Motion.button>

        {/* TEXT */}
        <Motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="space-y-4 flex flex-col justify-center"
        >
          <h1 className="text-4xl font-semibold">
            Hi, I’m <span className="text-blue-600">{hero.name} 👋</span>
          </h1>
          <p className="text-3xl text-blue-500 font-semibold">{hero.title}</p>
          <p className="text-gray-700 max-w-xl">{hero.description}</p>
        </Motion.div>

        {/* IMAGE */}
        <Motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.1 }}
          className="flex justify-center items-center"
        >
          <img
            src={`${API}/uploads/${hero.image}`}
            alt="Hero"
            className="w-72 max-h-full object-contain rounded-2xl shadow-xl"
          />
        </Motion.div>
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
                Edit Hero Section
              </h2>

              <input
                className="w-full border p-3 rounded-lg"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                className="w-full border p-3 rounded-lg"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              <textarea
                rows={4}
                className="w-full border p-3 rounded-lg"
                placeholder="Description"
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
                  onClick={saveHero}
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

export default EditHero;
