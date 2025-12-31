import React, { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Pencil, X } from "lucide-react";
import Skeleton from "../component/ui/Skeleton";
import { fadeUp, scaleIn, hover, tap } from "../animation/motion";

const API = import.meta.env.VITE_API_URL;

const EditSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  /* LOAD */
  const loadSkills = async () => {
    try {
      const res = await fetch(`${API}/api/skills`);
      setSkills(await res.json());
    } catch (err) {
      console.error("Failed to load skills:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  /* SAVE */
  const saveSkill = async (form, edit = false) => {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("color", form.color);
    if (form.icon) fd.append("icon", form.icon);

    await fetch(edit ? `${API}/api/skills/${form.id}` : `${API}/api/skills`, {
      method: edit ? "PUT" : "POST",
      body: fd,
    });

    setAddModal(false);
    setEditModal(null);
    loadSkills();
  };

  /* DELETE */
  const deleteSkill = async () => {
    await fetch(`${API}/api/skills/${deleteModal.id}`, {
      method: "DELETE",
    });
    setDeleteModal(null);
    loadSkills();
  };

  /* LOADING */
  if (loading) {
    return (
      <section className="pt-24 w-[90%] mx-auto">
        <Skeleton className="h-10 w-40 mx-auto mb-10" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="w-[90%] mx-auto font-[Poppins] pb-12">
        <Motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-center text-4xl font-semibold mb-6"
        >
          Skills
        </Motion.h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {/* ADD */}
          <Motion.div
            whileHover={hover}
            whileTap={tap}
            onClick={() => setAddModal(true)}
            className="h-40 rounded-2xl border flex flex-col items-center justify-center cursor-pointer bg-white shadow"
          >
            <Plus size={36} className="text-blue-600" />
            <p className="mt-1 font-medium">Add Skill</p>
          </Motion.div>

          {skills.map((s) => (
            <Motion.div
              key={s._id}
              whileHover={hover}
              className="relative h-40 rounded-2xl border bg-white flex flex-col items-center justify-center shadow"
            >
              <button
                onClick={() =>
                  setEditModal({
                    id: s._id,
                    name: s.name,
                    color: s.color,
                  })
                }
                className="absolute top-2 right-2"
              >
                <Pencil size={14} />
              </button>

              <button
                onClick={() => setDeleteModal({ id: s._id, name: s.name })}
                className="absolute top-8 right-2 text-red-600"
              >
                <Trash2 size={14} />
              </button>

              <img
                src={`${API}/uploads/${s.icon}`}
                alt={s.name}
                className="w-12 mb-2"
                style={{ filter: `drop-shadow(0 0 6px ${s.color})` }}
              />
              <p className="font-medium">{s.name}</p>
            </Motion.div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {(addModal || editModal) && (
          <Modal
            onClose={() => {
              setAddModal(false);
              setEditModal(null);
            }}
          >
            <SkillForm
              title={editModal ? "Edit Skill" : "Add Skill"}
              formData={editModal}
              submit={(f) => saveSkill(f, !!editModal)}
              cancel={() => {
                setAddModal(false);
                setEditModal(null);
              }}
            />
          </Modal>
        )}

        {deleteModal && (
          <Modal onClose={() => setDeleteModal(null)}>
            <ConfirmDelete
              name={deleteModal.name}
              confirm={deleteSkill}
              cancel={() => setDeleteModal(null)}
            />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

/* Helpers */

const Modal = ({ children, onClose }) => (
  <Motion.div
    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
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
      className="bg-white rounded-2xl p-6 w-[90%] max-w-md relative"
    >
      <button onClick={onClose} className="absolute top-4 right-4">
        <X />
      </button>
      {children}
    </Motion.div>
  </Motion.div>
);

const SkillForm = ({ title, formData = {}, submit, cancel }) => {
  const [form, setForm] = useState({
    id: formData?.id,
    name: formData?.name || "",
    color: formData?.color || "",
    icon: null,
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center">{title}</h2>

      <input
        className="w-full border p-3 rounded-lg"
        placeholder="Skill name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        className="w-full border p-3 rounded-lg"
        placeholder="Color (hex)"
        value={form.color}
        onChange={(e) => setForm({ ...form, color: e.target.value })}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setForm({ ...form, icon: e.target.files?.[0] })}
      />

      <div className="flex justify-end gap-4">
        <button onClick={cancel} className="border px-5 py-2 rounded-lg">
          Cancel
        </button>
        <button
          onClick={() => submit(form)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Save
        </button>
      </div>
    </div>
  );
};

const ConfirmDelete = ({ name, confirm, cancel }) => (
  <div className="text-center space-y-4">
    <h2 className="text-xl font-semibold">Delete {name}?</h2>
    <div className="flex justify-center gap-4">
      <button onClick={cancel} className="border px-5 py-2 rounded-lg">
        Cancel
      </button>
      <button
        onClick={confirm}
        className="bg-red-600 text-white px-6 py-2 rounded-lg"
      >
        Delete
      </button>
    </div>
  </div>
);

export default EditSkills;
