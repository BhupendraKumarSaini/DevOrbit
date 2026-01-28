import React, { useEffect, useState, useRef } from "react";
import { motion as Motion } from "framer-motion";
import { Pencil } from "lucide-react";
import Skeleton from "../component/ui/Skeleton";
import { fadeUp, hover, tap } from "../animation/motion";
import { apiFetch } from "../lib/api";
import Modal from "../component/ui/Modal";
import { isEmpty, isValidImage } from "../utils/validators";
import toast from "react-hot-toast";

const EditHero = () => {
  const imageInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [hero, setHero] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    role: "",
    headline: "",
    profileImage: null,
    storedImage: "",
  });

  /* LOAD PROFILE */
  const loadHero = async () => {
    try {
      const data = await apiFetch("/api/hero");
      setHero(data);

      setForm({
        name: data?.name || "",
        role: data?.role || "",
        headline: data?.headline || "",
        profileImage: null,
        storedImage: data?.profileImage || "",
      });
    } catch {
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    loadHero();
  }, []);

  /* SAVE */
  const saveHero = async () => {
    if (isEmpty(form.name)) return toast.error("Name is required");
    if (isEmpty(form.role)) return toast.error("Role is required");
    if (isEmpty(form.headline)) return toast.error("Headline is required");

    if (form.profileImage && !isValidImage(form.profileImage)) {
      return toast.error("Invalid image (max 2MB)");
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("role", form.role);
      fd.append("headline", form.headline);
      if (form.profileImage) fd.append("profileImage", form.profileImage);

      await apiFetch("/api/hero", { method: "PUT", body: fd });

      toast.success("Profile updated");
      setOpenModal(false);
      loadHero();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
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
      <section className="h-[calc(100vh-8rem)] w-[95%] md:w-[70%] mx-auto grid md:grid-cols-2 gap-12 font-[Poppins] relative">
        <Motion.button
          onClick={() => setOpenModal(true)}
          whileHover={hover}
          whileTap={tap}
          className="absolute right-1 top-1 p-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer"
        >
          <Pencil size={21} />
        </Motion.button>

        {/* TEXT */}
        <Motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="space-y-4 flex flex-col justify-center"
        >
          <h1 className="text-4xl font-semibold">{hero.name}</h1>
          <p className="text-2xl text-blue-600 font-semibold">{hero.role}</p>
          <p className="text-gray-700 max-w-xl">{hero.headline}</p>
        </Motion.div>

        {/* IMAGE */}
        <Motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex justify-center items-center"
        >
          <img
            src={`${import.meta.env.VITE_API_URL}/uploads/hero/${hero.profileImage}`}
            alt="Profile"
            className="w-72 rounded-2xl shadow-xl"
          />
        </Motion.div>
      </section>

      {/* MODAL */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <h2 className="text-xl font-semibold text-center mb-4">
          Edit Profile Header
        </h2>

        <input
          className="w-full border p-3 rounded-lg mb-3"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="w-full border p-3 rounded-lg mb-3"
          placeholder="Role (e.g. Full Stack Developer)"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        />

        <textarea
          rows={3}
          maxLength={120}
          className="w-full border p-3 rounded-lg"
          placeholder="Professional headline (max 120 chars)"
          value={form.headline}
          onChange={(e) => setForm({ ...form, headline: e.target.value })}
        />

        {/* IMAGE */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-3">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                setForm({
                  ...form,
                  profileImage: e.target.files?.[0] || null,
                })
              }
            />

            {/* Upload button */}
            <Motion.button
              type="button"
              whileHover={hover}
              whileTap={tap}
              onClick={() => imageInputRef.current?.click()}
              className="px-4 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              Upload Image
            </Motion.button>

            {/* File name */}
            <span
              className="text-sm text-gray-600 truncate max-w-[220px]"
              title={
                form.profileImage
                  ? form.profileImage.name
                  : form.storedImage
                    ? form.storedImage.replace(/^\d+-/, "")
                    : "No image selected"
              }
            >
              {form.profileImage
                ? form.profileImage.name
                : form.storedImage
                  ? form.storedImage.replace(/^\d+-/, "")
                  : "No image selected"}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6">
          <Motion.button
            whileHover={hover}
            whileTap={tap}
            onClick={() => setOpenModal(false)}
            className="px-6 py-2 border rounded-lg"
          >
            Cancel
          </Motion.button>

          <Motion.button
            whileHover={hover}
            whileTap={tap}
            disabled={loading}
            onClick={saveHero}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </Motion.button>
        </div>
      </Modal>
    </>
  );
};

export default EditHero;
