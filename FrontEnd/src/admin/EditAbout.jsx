import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { Edit } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const EditAbout = () => {
  const [about, setAbout] = useState(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const [form, setForm] = useState({
    description: "",
    image: null,
  });

  /* Detect screen size */
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* Fetch about data */
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
    const fetchData = async () => {
      await loadAbout();
    };
    fetchData();
  }, []);

  /* Save update */
  const saveAbout = async () => {
    const fd = new FormData();
    fd.append("description", form.description);
    if (form.image) fd.append("image", form.image);

    try {
      await fetch(`${API}/api/about`, {
        method: "PUT",
        body: fd,
      });

      setOpenModal(false);
      loadAbout();
    } catch (err) {
      console.log(err);
    }
  };

  if (!about) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <section
        id="about"
        className="min-h-screen overflow-hidden w-[95%] sm:w-[85%] md:w-[80%] lg:w-[70%] mx-auto flex flex-col pt-24 font-[Poppins] relative"
      >
        {/* EDIT ICON */}
        <Motion.button
          onClick={() => setOpenModal(true)}
          whileHover={{ scale: 1.1, opacity: 0.9 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 16 }}
          className="absolute right-1 sm:top-23 sm:right-1 md:top-23 md:right-1 lg:top-23 lg:right-1 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-black cursor-pointer"
        >
          <Edit size={18} />
        </Motion.button>

        {/* Title */}
        <Motion.h1
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center text-4xl sm:text-5xl font-semibold text-black"
        >
          About <span className="text-blue-700">Me</span>
        </Motion.h1>

        <div className="flex flex-col md:flex-row items-center gap-12 mt-12">
          {/* LEFT IMAGE */}
          <Motion.img
            initial={
              isDesktop ? { x: -60, opacity: 0 } : { opacity: 0, scale: 0.9 }
            }
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            src={`${API}/uploads/${about.image}`}
            alt="About"
            width="300"
            className="rounded-2xl shadow-[0_8px_10px_rgba(0,0,0,0.2)] mx-auto md:mx-0"
          />

          {/* RIGHT TEXT */}
          <Motion.div
            initial={
              isDesktop
                ? { x: 60, opacity: 0 } // desktop Animation
                : { opacity: 0, y: 40 } // mobile/tablet Animation
            }
            whileInView={{ x: 0, y: 0, opacity: 1 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-lg sm:text-xl text-gray-700 leading-relaxed text-center md:text-left max-w-xl sm:max-w-2xl mx-auto md:mx-0"
          >
            {(() => {
              const text = about?.description || "";
              // 1) If the text already has blank lines, split on them
              if (/\r?\n\r?\n/.test(text)) {
                return text.split(/\r?\n\r?\n/).map((para, idx) => (
                  <p key={idx} className="mb-4">
                    {para}
                  </p>
                ));
              }

              // 2) Otherwise split into sentences and form two balanced paragraphs
              const sentences = text.split(/(?<=[.?!])\s+/);
              if (sentences.length <= 1) {
                return <p className="mb-4">{text}</p>;
              }
              const mid = Math.ceil(sentences.length / 2);
              const first = sentences.slice(0, mid).join(" ");
              const second = sentences.slice(mid).join(" ");
              return (
                <>
                  <p className="mb-4">{first}</p>
                  <p className="mb-4">{second}</p>
                </>
              );
            })()}
          </Motion.div>
        </div>
      </section>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-xl space-y-5 font-[Poppins] shadow-xl">
            <h2 className="text-xl font-bold text-center">
              Edit About Section
            </h2>

            {/* DESCRIPTION */}
            <div>
              <label className="block font-medium mb-1">Description</label>
              <Motion.textarea
                rows={5}
                whileFocus={{ scale: 1.02 }}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border p-3 rounded-lg cursor-pointer"
              />
            </div>

            {/* Upload Row */}
            <div className="flex items-center gap-4">
              <Motion.label
                htmlFor="imageUpload"
                whileHover={{ scale: 1.05, opacity: 0.9 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="cursor-pointer bg-gray-800 text-white px-5 py-3 rounded-xl shadow hover:bg-gray-900"
              >
                Upload Image
              </Motion.label>

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

              {/* File name */}
              {form.image ? (
                <p className="text-gray-800 text-sm">{form.image.name}</p>
              ) : (
                <p className="text-gray-500 text-sm">Current: {about.image}</p>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-2">
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
                onClick={saveAbout}
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

export default EditAbout;
