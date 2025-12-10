import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { Trash2, Plus, X, Pencil } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const EditSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ADD MODAL */
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: "",
    color: "",
    icon: null,
  });

  /* EDIT MODAL */
  const [editModal, setEditModal] = useState({
    open: false,
    id: null,
    name: "",
    color: "",
    icon: null,
    oldIcon: "",
  });

  /* DELETE MODAL */
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
    name: "",
  });

  /* FETCH SKILLS */
  const loadSkills = async () => {
    try {
      const res = await fetch(`${API}/api/skills`);
      const data = await res.json();
      setSkills(data);
    } catch (err) {
      console.log("Failed to fetch skills", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  /* ADD SKILL */
  const addSkill = async () => {
    const fd = new FormData();
    fd.append("name", newSkill.name);
    fd.append("color", newSkill.color);
    if (newSkill.icon) fd.append("icon", newSkill.icon);

    await fetch(`${API}/api/skills`, {
      method: "POST",
      body: fd,
    });

    setOpenAddModal(false);
    setNewSkill({ name: "", color: "", icon: null });
    loadSkills();
  };

  /* OPEN EDIT POPUP */
  const openEditPopup = (skill) => {
    setEditModal({
      open: true,
      id: skill._id,
      name: skill.name,
      color: skill.color,
      icon: null,
      oldIcon: skill.icon,
    });
  };

  /* SAVE EDIT */
  const saveEdit = async () => {
    const fd = new FormData();
    fd.append("name", editModal.name);
    fd.append("color", editModal.color);
    if (editModal.icon) fd.append("icon", editModal.icon);

    await fetch(`${API}/api/skills/${editModal.id}`, {
      method: "PUT",
      body: fd,
    });

    setEditModal({ open: false });
    loadSkills();
  };

  /* DELETE */
  const confirmDelete = async () => {
    await fetch(`${API}/api/skills/${deleteModal.id}`, {
      method: "DELETE",
    });
    setDeleteModal({ open: false });
    loadSkills();
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <>
      <section className="pt-20 w-[95%] sm:w-[85%] md:w-[80%] lg:w-[70%] mx-auto font-[Poppins]">
        <Motion.h1
          initial={{ y: -40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center text-5xl font-semibold text-blue-700 mb-7"
        >
          Skills
        </Motion.h1>

        <Motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.3 }}
          variants={{ hidden: {}, visible: {} }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 place-items-center   /* ensures equal alignment on all devices */"
        >
          {/* ADD BUTTON CARD */}
          <Motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            whileHover={{ y: -8, scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 250, damping: 18 }}
            className="h-40 w-full max-w-[260px] rounded-2xl flex flex-col justify-center items-center border border-gray-200 bg-white/80 cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.15)]"
            onClick={() => setOpenAddModal(true)}
          >
            <Plus size={40} className="text-blue-600" />
            <p className="mt-2 text-lg text-gray-700 font-medium">Add Skill</p>
          </Motion.div>

          {/* SKILL CARDS */}
          {skills.map((skill, i) => (
            <Motion.div
              key={skill._id}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              whileHover={{ y: -8, scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="relative h-40 w-full max-w-[260px] rounded-2xl flex flex-col items-center justify-center border border-gray-200 bg-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.15)] cursor-pointer mb-5"
            >
              {/* EDIT ICON */}
              <button
                onClick={() => openEditPopup(skill)}
                className="absolute top-0 right-0 p-2 rounded-full text-blue-700 hover:bg-gray-200 hover:cursor-pointer"
              >
                <Pencil size={14} />
              </button>

              {/* DELETE ICON */}
              <button
                onClick={() =>
                  setDeleteModal({
                    open: true,
                    id: skill._id,
                    name: skill.name,
                  })
                }
                className="absolute top-6 right-0 p-2 rounded-full text-red-700 hover:bg-gray-200 hover:cursor-pointer"
              >
                <Trash2 size={14} />
              </button>

              <img
                src={`${API}/uploads/${skill.icon}`}
                className="w-14 mb-2 p-3 border border-gray-200 rounded-xl"
                style={{ filter: `drop-shadow(0 0 5px ${skill.color})` }}
              />
              <p className="text-gray-700 text-lg font-medium">{skill.name}</p>
            </Motion.div>
          ))}
        </Motion.div>
      </section>

      {/* ADD SKILL MODAL */}
      {openAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white w-[90%] max-w-lg rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex">
              <h2 className="text-xl font-semibold ml-auto">Add New Skill</h2>
              <X
                className="cursor-pointer text-gray-600 ml-auto"
                onClick={() => setOpenAddModal(false)}
              />
            </div>

            {/* Name */}
            <div>
              <label className="font-medium text-gray-600">Skill Name</label>
              <Motion.input
                whileFocus={{ scale: 1.03 }}
                className="w-full border p-3 rounded-xl mt-1 cursor-pointer"
                placeholder="React, MongoDB..."
                value={newSkill.name}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, name: e.target.value })
                }
              />
            </div>

            {/* Color */}
            <div>
              <label className="font-medium text-gray-600">Shadow Color</label>
              <br />
              <Motion.input
                type="color"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-10 cursor-pointer border rounded-lg mt-1"
                value={newSkill.color}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, color: e.target.value })
                }
              />
            </div>

            {/* Upload Icon */}
            <div className="flex items-center gap-4">
              <Motion.label
                htmlFor="skillIcon"
                whileHover={{ scale: 1.05, opacity: 0.9 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="cursor-pointer bg-gray-800 text-white px-5 py-3 rounded-xl hover:bg-gray-900"
              >
                Upload Icon
              </Motion.label>

              <input
                id="skillIcon"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  setNewSkill({ ...newSkill, icon: e.target.files[0] })
                }
              />

              {newSkill.icon && (
                <p className="text-gray-700">{newSkill.icon.name}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-1">
              <Motion.button
                onClick={() => setOpenAddModal(false)}
                whileHover={{ scale: 1.05, opacity: 0.9 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="px-6 py-3 border rounded-xl hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </Motion.button>

              <Motion.button
                onClick={addSkill}
                whileHover={{ scale: 1.05, opacity: 0.95 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              >
                Save
              </Motion.button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal.open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white w-[90%] max-w-lg rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex">
              <h2 className="text-xl font-semibold ml-auto">Edit Skill</h2>
              <X
                className="cursor-pointer text-gray-600 ml-auto"
                onClick={() => setEditModal({ open: false })}
              />
            </div>

            {/* Name */}
            <div>
              <label className="font-medium">Skill Name</label>
              <Motion.input
                whileFocus={{ scale: 1.03 }}
                className="w-full border p-3 rounded-xl mt-1 cursor-pointer"
                value={editModal.name}
                onChange={(e) =>
                  setEditModal({ ...editModal, name: e.target.value })
                }
              />
            </div>

            {/* Color */}
            <div>
              <label className="font-medium">Shadow Color</label>
              <br />
              <Motion.input
                type="color"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-10 cursor-pointer border rounded-lg mt-1"
                value={editModal.color}
                onChange={(e) =>
                  setEditModal({ ...editModal, color: e.target.value })
                }
              />
            </div>

            {/* Icon Upload */}
            <div className="flex items-center gap-4">
              <Motion.label
                htmlFor="skillIconEdit"
                whileHover={{ scale: 1.05, opacity: 0.9 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="cursor-pointer bg-gray-800 text-white px-5 py-3 rounded-xl hover:bg-gray-900"
              >
                Upload Icon
              </Motion.label>

              <input
                id="skillIconEdit"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  setEditModal({ ...editModal, icon: e.target.files[0] })
                }
              />

              {editModal.icon ? (
                <p className="text-gray-700">{editModal.icon.name}</p>
              ) : (
                <p className="text-gray-500">Current: {editModal.oldIcon}</p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Motion.button
                onClick={() => setEditModal({ open: false })}
                whileHover={{ scale: 1.05, opacity: 0.9 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="px-6 py-3 border rounded-xl hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </Motion.button>

              <Motion.button
                onClick={saveEdit}
                whileHover={{ scale: 1.05, opacity: 0.95 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              >
                Save
              </Motion.button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white w-[90%] max-w-md rounded-2xl p-6 shadow-xl text-center space-y-4">
            <h2 className="text-xl font-semibold">Delete Skill?</h2>
            <p className="text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-medium text-red-600">
                {deleteModal.name}
              </span>{" "}
              ?
            </p>

            <div className="flex justify-center gap-4">
              <Motion.button
                onClick={() => setDeleteModal({ open: false })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="px-6 py-3 border rounded-xl hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </Motion.button>

              <Motion.button
                onClick={confirmDelete}
                whileHover={{ scale: 1.05, x: [0, -2, 2, -2, 2, 0] }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                Yes, Delete
              </Motion.button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditSkills;
