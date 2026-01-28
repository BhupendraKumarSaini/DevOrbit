import React, { useEffect, useRef, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Pencil, Github, Linkedin, Mail, X } from "lucide-react";
import Skeleton from "../component/ui/Skeleton";
import { fadeUp, scaleIn, hover, tap } from "../animation/motion";
import { apiFetch } from "../lib/api";
import Modal from "../component/ui/Modal";
import { isValidEmail, isValidURL, isValidPDF } from "../utils/validators";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL;

const EditFooter = () => {
  const fileInputRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [footer, setFooter] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [form, setForm] = useState({
    github: "",
    linkedin: "",
    email: "",
    resume: null,
    oldResume: "",
  });

  const downloadResume = async () => {
    if (!footer?.resume) {
      return toast.error("Resume not available");
    }

    try {
      const res = await fetch(`${API}/uploads/resume/${footer.resume}`);
      const blob = await res.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = footer.resume.replace(/^\d+-/, "");
      link.click();

      toast.success("Resume downloaded");
    } catch {
      toast.error("Failed to download resume");
    }
  };

  /* LOAD */
  const loadFooter = async () => {
    try {
      const data = await apiFetch("/api/footer");
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
    // Validation
    if (!isValidURL(form.github)) {
      return toast.error("Please enter a valid GitHub URL");
    }

    if (!isValidURL(form.linkedin)) {
      return toast.error("Please enter a valid LinkedIn URL");
    }

    if (!isValidEmail(form.email)) {
      return toast.error("Please enter a valid email address");
    }

    if (form.resume && !isValidPDF(form.resume)) {
      return toast.error("Resume must be a PDF (max 5MB)");
    }

    const fd = new FormData();
    fd.append("github", form.github);
    fd.append("linkedin", form.linkedin);
    fd.append("email", form.email);
    if (form.resume) fd.append("resume", form.resume);

    setSaving(true);

    try {
      await apiFetch("/api/footer", {
        method: "PUT",
        body: fd,
      });

      toast.success("Footer updated successfully");
      setEditModal(false);
      loadFooter();
    } catch (error) {
      toast.error(error.message || "Failed to update footer");
    } finally {
      setSaving(false);
    }
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
          className="relative bg-white/90 backdrop-blur-lg rounded-2xl p-10 shadow-xl text-center min-w-[320px] border border-gray-200"
        >
          {/* EDIT */}
          <Motion.button
            whileHover={hover}
            whileTap={tap}
            onClick={() => setEditModal(true)}
            className="absolute top-3 right-3 text-whit cursor-pointer
            p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            <Pencil size={14} />
          </Motion.button>

          {/* RESUME */}
          {footer.resume && (
            <Motion.button
              whileHover={hover}
              whileTap={tap}
              onClick={downloadResume}
              className="text-blue-600 font-medium mb-6 hover:bg-gray-300 cursor-pointer border border-gray-300 py-2 px-4 rounded-xl"
            >
              Resume
            </Motion.button>
          )}

          {/* SOCIALS */}
          <div className="flex gap-6 justify-center text-gray-700">
            {[
              { icon: Github, link: footer.github },
              { icon: Linkedin, link: footer.linkedin },
              { icon: Mail, link: `mailto:${footer.email}` },
            ].map(({ icon: Icon, link }, i) => (
              <Motion.a
                key={i}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={hover}
                whileTap={tap}
                className="cursor-pointer hover:text-blue-600"
                aria-label="Footer social link"
              >
                <Icon size={22} />
              </Motion.a>
            ))}
          </div>
        </Motion.div>
      </section>

      {/* MODAL */}
      <Modal
        open={editModal}
        onClose={() => setEditModal(false)}
        maxWidth="max-w-md"
      >
        <div className="space-y-5">
          <h2 className="text-xl font-semibold text-center">Edit Footer</h2>

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
          <div className="space-y-2">
            <label className="block font-medium">Resume (PDF)</label>

            <div className="flex items-center gap-3">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) =>
                  setForm({ ...form, resume: e.target.files?.[0] || null })
                }
              />

              {/* Upload button */}
              <Motion.button
                type="button"
                whileHover={hover}
                whileTap={tap}
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Upload Resume
              </Motion.button>

              {/* File name */}
              <span className="text-sm text-gray-600 truncate max-w-[200px]">
                {form.resume
                  ? form.resume.name
                  : form.oldResume
                    ? form.oldResume.replace(/^\d+-/, "")
                    : "No file selected"}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Motion.button
              whileHover={hover}
              whileTap={tap}
              className="px-6 py-3 border rounded-xl"
              onClick={() => setEditModal(false)}
            >
              Cancel
            </Motion.button>
            <Motion.button
              whileHover={hover}
              whileTap={tap}
              onClick={saveFooter}
              disabled={saving}
              className={`px-6 py-3 rounded-xl text-white ${
                saving
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {saving ? "Saving..." : "Save"}
            </Motion.button>
          </div>
        </div>
      </Modal>
    </>
  );
};

/* Helpers */
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
