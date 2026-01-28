import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { Pencil, Trash2, Plus } from "lucide-react";
import Skeleton from "../component/ui/Skeleton";
import { fadeUp, hover, tap } from "../animation/motion";
import { apiFetch } from "../lib/api";
import Modal from "../component/ui/Modal";
import toast from "react-hot-toast";

const EditAbout = () => {
  const [loading, setLoading] = useState(false);
  const [about, setAbout] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [points, setPoints] = useState([""]);

  /* LOAD */
  const loadAbout = async () => {
    try {
      const data = await apiFetch("/api/about");
      setAbout(data);
      setPoints(data?.points?.length ? data.points : [""]);
    } catch {
      toast.error("Failed to load summary");
    }
  };

  useEffect(() => {
    loadAbout();
  }, []);

  /* ADD / REMOVE */
  const addPoint = () => {
    if (points.length >= 5) return;
    setPoints([...points, ""]);
  };

  const removePoint = (i) => {
    if (points.length <= 1) return;
    setPoints(points.filter((_, idx) => idx !== i));
  };

  /* SAVE */
  const saveAbout = async () => {
    const cleanPoints = points.map((p) => p.trim()).filter(Boolean);

    if (cleanPoints.length < 2) {
      return toast.error("At least 2 summary points required");
    }

    setLoading(true);
    try {
      await apiFetch("/api/about", {
        method: "PUT",
        body: JSON.stringify({ points: cleanPoints }),
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Professional summary updated");
      setOpenModal(false);
      loadAbout();
    } catch (e) {
      toast.error(e.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  /* LOADING */
  if (!about) {
    return (
      <section className="pt-32 w-[90%] mx-auto">
        <Skeleton className="h-10 w-56 mx-auto mb-6" />
        <Skeleton className="h-40 w-full max-w-xl mx-auto rounded-2xl" />
      </section>
    );
  }

  return (
    <>
      {/* PREVIEW */}
      <section className="min-h-[60vh] w-[95%] md:w-[80%] mx-auto font-[Poppins] relative">
        <Motion.button
          onClick={() => setOpenModal(true)}
          whileHover={hover}
          whileTap={tap}
          className="absolute right-1 top-1 p-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer"
        >
          <Pencil size={21} />
        </Motion.button>

        <Motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-center text-4xl font-semibold mb-8"
        >
          Professional <span className="text-blue-600">Summary</span>
        </Motion.h1>

        <ul className="max-w-3xl mx-auto space-y-4 text-gray-700 text-lg list-disc list-inside">
          {about.points?.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </section>

      {/* MODAL */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <h2 className="text-xl font-semibold text-center mb-4">
          Edit Professional Summary
        </h2>

        <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
          {points.map((p, i) => (
            <div key={i} className="flex gap-2 items-start">
              <textarea
                rows={2}
                className="flex-1 border p-3 rounded-lg resize-none"
                placeholder={`Summary point ${i + 1}`}
                value={p}
                onChange={(e) => {
                  const copy = [...points];
                  copy[i] = e.target.value;
                  setPoints(copy);
                }}
              />

              {points.length > 1 && (
                <button
                  onClick={() => removePoint(i)}
                  className="text-red-600 mt-4 p-2 rounded-lg bg-red-100 hover:bg-red-200 cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* ADD BUTTON */}
        {points.length < 5 && (
          <Motion.button
            whileHover={hover}
            whileTap={tap}
            onClick={addPoint}
            className="flex items-center gap-2 text-blue-600 mt-4"
          >
            <Plus size={16} /> Add point
          </Motion.button>
        )}

        {/* ACTIONS */}
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
            onClick={saveAbout}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </Motion.button>
        </div>
      </Modal>
    </>
  );
};

export default EditAbout;
