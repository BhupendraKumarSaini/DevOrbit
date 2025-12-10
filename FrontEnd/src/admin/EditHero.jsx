import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { Edit } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const EditHero = () => {
  const [hero, setHero] = useState(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    title: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* Fetch Hero from DB */
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
    const fetchData = async () => {
      await loadHero();
    };
    fetchData();
  }, []);

  /* Save Update */
  const saveHero = async () => {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("title", form.title);
    fd.append("description", form.description);

    if (form.image) fd.append("image", form.image);

    try {
      await fetch(`${API}/api/hero`, {
        method: "PUT",
        body: fd,
      });

      setOpenModal(false);
      loadHero();
    } catch (err) {
      console.log(err);
    }
  };

  if (!hero) return <p className="text-center mt-20">Loading...</p>;

  return (
    <>
      <section
        id="home"
        className="min-h-screen overflow-hidden w-[95%] sm:w-[85%] md:w-[80%] lg:w-[70%] mx-auto flex flex-col-reverse md:grid md:grid-cols-2 items-center pt-30 gap-10 font-[Poppins] relative"
      >
        {/* EDIT ICON */}
        <Motion.button
          onClick={() => setOpenModal(true)}
          whileHover={{ scale: 1.1, opacity: 0.9 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 16 }}
          className="absolute top-21 right-1 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-black cursor-pointer"
        >
          <Edit size={18} />
        </Motion.button>

        {/* LEFT TEXT */}
        <Motion.div
          initial={isDesktop ? { x: -60, opacity: 0 } : { opacity: 0, y: 40 }}
          whileInView={{ x: 0, y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ amount: 0.4 }}
          className="text-center md:text-left flex flex-col justify-center mb-3"
        >
          <h1 className="text-4xl sm:text-5xl font-semibold text-black leading-snug">
            Hi, I&apos;m <span className="text-blue-700">{hero.name} 👋</span>
          </h1>

          <p className="text-3xl sm:text-4xl font-semibold text-blue-600 mt-3">
            {hero.title}
          </p>

          <p className="mt-5 text-gray-700 text-lg leading-relaxed max-w-xl md:max-w-lg mx-auto md:mx-0">
            {hero.description}
          </p>
        </Motion.div>

        {/* RIGHT IMAGE */}
        <Motion.div
          initial={
            isDesktop ? { x: 60, opacity: 0 } : { opacity: 0, scale: 0.85 }
          }
          whileInView={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ amount: 0.4 }}
          className="flex justify-center md:justify-end "
        >
          <div className="rounded-2xl overflow-hidden shadow-xl backdrop-blur-lg bg-white/20 border border-white/30 w-[260px] sm:w-[300px] md:w-[330px] lg:w-[300px] ">
            <img
              src={`${API}/uploads/${hero.image}`}
              alt="Hero"
              className="w-75 h-100"
            />
          </div>
        </Motion.div>
      </section>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl px-6 py-3 w-[90%] max-w-xl space-y-3 font-[Poppins] shadow-xl">
            <h2 className="text-xl font-bold text-center">Edit Hero Section</h2>

            <div>
              <label className="block font-medium mb-1">Name</label>
              <Motion.input
                whileFocus={{ scale: 1.02 }}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border p-3 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Title</label>
              <Motion.input
                whileFocus={{ scale: 1.02 }}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border p-3 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Description</label>
              <Motion.textarea
                rows={4}
                whileFocus={{ scale: 1.02 }}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border p-3 rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex sm:flex-row items-center gap-4">
              {/* Upload Button */}
              <Motion.label
                htmlFor="imageUpload"
                whileHover={{ scale: 1.05, opacity: 0.9 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="cursor-pointer bg-gray-800 text-white px-5 py-3 rounded-xl shadow hover:bg-gray-900"
              >
                Upload Image
              </Motion.label>

              {/* Hidden real input */}
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setForm({ ...form, image: file });
                }}
              />

              {/* Selected file name */}
              {form.image ? (
                <p className="text-gray-800 text-sm">{form.image.name}</p>
              ) : (
                <p className="text-gray-800 text-sm">Current: {hero.image}</p>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <Motion.button
                onClick={() => setOpenModal(false)}
                whileHover={{ scale: 1.05, opacity: 0.9 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="px-6 py-3 border rounded-xl cursor-pointer hover:bg-gray-100"
              >
                Cancel
              </Motion.button>

              <Motion.button
                onClick={saveHero}
                whileHover={{ scale: 1.05, opacity: 0.95 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
              >
                Save
              </Motion.button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditHero;
