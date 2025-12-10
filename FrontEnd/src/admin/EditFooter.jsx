import React, { useState, useEffect } from "react";
import { Pencil, X, Github, Linkedin, Mail } from "lucide-react";
import { motion as Motion } from "framer-motion";

const API = import.meta.env.VITE_API_URL;

const EditFooter = () => {
  const [footer, setFooter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);

  const [form, setForm] = useState({
    github: "",
    linkedin: "",
    email: "",
    resume: null,
    oldResume: "",
  });

  /* FETCH FOOTER */
  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await fetch(`${API}/api/footer`);
        const data = await res.json();
        setFooter(data);

        setForm({
          github: data?.github || "",
          linkedin: data?.linkedin || "",
          email: data?.email || "",
          resume: null,
          oldResume: data?.resume || "",
        });
      } catch (err) {
        console.log("Failed to fetch footer", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFooter();
  }, []);

  /* Force Resume Download */
  const handleResumeDownload = async () => {
    try {
      const url = `${API}/uploads/resume/${footer.resume}`;

      const res = await fetch(url);
      const blob = await res.blob();

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = footer.resume;
      link.click();
    } catch (err) {
      console.log("Download error:", err);
    }
  };

  /* Open Email App */
  const handleEmailClick = () => {
    if (!footer.email) return;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${footer.email}`;
    window.open(gmailUrl, "_blank");
  };

  /* SAVE UPDATE */
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

    const refreshed = await fetch(`${API}/api/footer`);
    setFooter(await refreshed.json());
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <>
      <section className="pt-40 min-h-[80vh] flex justify-center items-center font-[Poppins]">
        <div className="relative w-[50%] sm:w-[70%] md:w-full bg-white/80 backdrop-blur-xl border border-gray-200 shadow-lg rounded-2xl px-30 py-10 flex flex-col items-center ">
          {/* Edit */}
          <div>
            <Motion.button
              onClick={() => setEditModal(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 16 }}
              className="absolute top-3 right-3 p-2 bg-gray-900 text-white rounded-full hover:bg-black cursor-pointer"
            >
              <Pencil size={18} />
            </Motion.button>
          </div>

          {/* Resume */}
          {footer.resume && (
            <Motion.button
              onClick={handleResumeDownload}
              whileHover={{ scale: 1.06, opacity: 0.9 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="text-gray-600 text-xl hover:text-blue-600 cursor-pointer mb-9"
            >
              Resume
            </Motion.button>
          )}

          {/* SOCIAL ICONS */}
          <div className="flex gap-6 mt-2">
            {/* GitHub */}
            <Motion.a
              href={footer.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="p-3 bg-white/60 border border-gray-200 rounded-full hover:bg-white/80 shadow"
            >
              <Github size={22} className="text-gray-700 hover:text-blue-600" />
            </Motion.a>

            {/* LinkedIn */}
            <Motion.a
              href={footer.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="p-3 bg-white/60 border border-gray-200 rounded-full hover:bg-white/80 shadow"
            >
              <Linkedin
                size={22}
                className="text-gray-700 hover:text-blue-600"
              />
            </Motion.a>

            {/* Email */}
            <Motion.button
              onClick={handleEmailClick}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="p-3 bg-white/60 border border-gray-200 rounded-full hover:bg-white/80 shadow"
            >
              <Mail
                size={22}
                className="text-gray-700 hover:text-blue-600 cursor-pointer"
              />
            </Motion.button>
          </div>
        </div>
      </section>

      {/* EDIT MODAL */}
      {editModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-xl shadow-xl space-y-4">
            <div className="flex">
              <h2 className="text-xl font-semibold ml-auto">
                Edit Footer Info
              </h2>
              <X
                className="cursor-pointer text-gray-600 ml-auto"
                onClick={() => setEditModal(false)}
              />
            </div>

            {/* Github */}
            <div>
              <label className="block font-medium mb-1">GitHub URL</label>
              <Motion.input
                whileFocus={{ scale: 1.03 }}
                value={form.github}
                onChange={(e) => setForm({ ...form, github: e.target.value })}
                className="w-full border p-3 rounded-lg cursor-pointer"
              />
            </div>

            {/* Linkedin */}
            <div>
              <label className="block font-medium mb-1">LinkedIn URL</label>
              <Motion.input
                whileFocus={{ scale: 1.03 }}
                value={form.github}
                onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                className="w-full border p-3 rounded-lg cursor-pointer"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-medium mb-1">Email Address</label>
              <Motion.input
                whileFocus={{ scale: 1.03 }}
                value={form.github}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border p-3 rounded-lg cursor-pointer"
              />
            </div>

            {/* Resume Upload */}
            <div className="flex items-center gap-4">
              <Motion.label
                htmlFor="resumeUpload"
                whileHover={{ scale: 1.05, opacity: 0.9 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="cursor-pointer bg-gray-800 text-white px-5 py-3 rounded-xl hover:bg-gray-900"
              >
                Upload Resume (PDF)
              </Motion.label>

              <input
                id="resumeUpload"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) =>
                  setForm({ ...form, resume: e.target.files[0] })
                }
              />

              {form.resume ? (
                <p className="text-gray-600">{form.resume.name}</p>
              ) : (
                <p className="text-gray-500">{form.oldResume}</p>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <Motion.button
                onClick={() => setEditModal(false)}
                whileHover={{ scale: 1.05, opacity: 0.9 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="px-6 py-3 border rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </Motion.button>

              <Motion.button
                onClick={saveFooter}
                whileHover={{ scale: 1.05, opacity: 0.95 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
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

export default EditFooter;
