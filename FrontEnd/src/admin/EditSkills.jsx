import React, { useEffect, useState, useRef } from "react";
import { motion as Motion } from "framer-motion";
import { Trash2, Plus, Pencil } from "lucide-react";
import Skeleton from "../component/ui/Skeleton";
import { fadeUp, hover, tap } from "../animation/motion";
import { apiFetch } from "../lib/api";
import Modal from "../component/ui/Modal";
import toast from "react-hot-toast";
import { isEmpty, isValidHexColor, isValidImage } from "../utils/validators";

const API = import.meta.env.VITE_API_URL;

const CATEGORIES = ["Frontend", "Backend", "Database", "DevOps", "Tools"];

const EditSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  const loadSkills = async () => {
    try {
      const data = await apiFetch("/api/skills");
      setSkills(data);
    } catch {
      toast.error("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const saveSkill = async (form, edit = false) => {
    if (isEmpty(form.name)) return toast.error("Skill name required");
    if (isEmpty(form.category)) return toast.error("Category required");
    if (!isValidHexColor(form.color)) return toast.error("Invalid hex color");
    if (!edit && !form.icon) return toast.error("Icon required");
    if (form.icon && !isValidImage(form.icon))
      return toast.error("Invalid image (max 2MB)");

    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("category", form.category);
      fd.append("color", form.color);
      if (form.icon) fd.append("icon", form.icon);

      await apiFetch(edit ? `/api/skills/${form.id}` : "/api/skills", {
        method: edit ? "PUT" : "POST",
        body: fd,
      });

      toast.success(edit ? "Skill updated" : "Skill added");
      setAddModal(false);
      setEditModal(null);
      loadSkills();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteSkill = async () => {
    try {
      await apiFetch(`/api/skills/${deleteModal._id}`, { method: "DELETE" });
      toast.success("Skill deleted");
      setDeleteModal(null);
      loadSkills();
    } catch {
      toast.error("Failed to delete skill");
    }
  };

  if (loading) {
    return (
      <section className="pt-24 w-[90%] mx-auto">
        <Skeleton className="h-10 w-40 mx-auto mb-10" />
      </section>
    );
  }

  return (
    <>
      <section className="w-[90%] mx-auto font-[Poppins] pb-12">
        <h1 className="text-center text-4xl font-semibold mb-6">Skills</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {/* ADD */}
          <Motion.div
            whileHover={hover}
            whileTap={tap}
            onClick={() => setAddModal(true)}
            className="h-40 rounded-2xl border-2 border-dashed border-blue-300 flex flex-col items-center justify-center gap-2 cursor-pointer bg-blue-50/50 hover:bg-blue-50"
          >
            <Plus size={36} className="text-blue-600" />
            <p className="font-medium text-blue-700">Add Skill</p>
          </Motion.div>

          {skills.map((s) => (
            <Motion.div
              key={s._id}
              whileHover={hover}
              className="relative h-40 rounded-2xl border border-gray-200 bg-white flex flex-col items-center justify-center shadow"
            >
              <Motion.button
                whileHover={hover}
                whileTap={tap}
                onClick={() => setEditModal(s)}
                className="absolute top-2 right-2 p-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer"
              >
                <Pencil size={14} />
              </Motion.button>

              <Motion.button
                whileHover={hover}
                whileTap={tap}
                onClick={() => setDeleteModal(s)}
                className="absolute top-10 right-2 text-red-600 p-2 rounded-lg bg-red-100 hover:bg-red-200 cursor-pointer"
              >
                <Trash2 size={14} />
              </Motion.button>

              <img
                src={`${API}/uploads/skills/${s.icon}`}
                className="w-12 mb-3 p-3 border rounded-xl"
                style={{
                  filter: `drop-shadow(0 0 6px ${s.color})`,
                }}
              />

              <p className="font-medium">{s.name}</p>
              <span className="text-xs text-gray-500">{s.category}</span>
            </Motion.div>
          ))}
        </div>
      </section>

      <Modal
        open={addModal || !!editModal}
        onClose={() => {
          setAddModal(false);
          setEditModal(null);
        }}
      >
        <SkillForm
          title={editModal ? "Edit Skill" : "Add Skill"}
          data={editModal}
          submit={(f) => saveSkill(f, !!editModal)}
          cancel={() => {
            setAddModal(false);
            setEditModal(null);
          }}
        />
      </Modal>

      <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)}>
        <ConfirmDelete
          name={deleteModal?.name}
          confirm={deleteSkill}
          cancel={() => setDeleteModal(null)}
        />
      </Modal>
    </>
  );
};

/* FORM */
const SkillForm = ({ title, data = {}, submit, cancel }) => {
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    id: data?._id,
    name: data?.name || "",
    category: data?.category || "",
    color: data?.color || "",
    icon: null,
    oldIcon: data?.icon || "",
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

      <select
        className="w-full border p-3 rounded-lg"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      >
        <option value="">Select category</option>
        {CATEGORIES.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <input
        className="w-full border p-3 rounded-lg"
        placeholder="Hex color"
        value={form.color}
        onChange={(e) => setForm({ ...form, color: e.target.value })}
      />

      {/* ICON UPLOAD */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          {/* Hidden input */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) =>
              setForm({ ...form, icon: e.target.files?.[0] || null })
            }
          />

          {/* Upload button */}
          <Motion.button
            whileHover={hover}
            whileTap={tap}
            type="button"
            onClick={() => fileRef.current.click()}
            className="border px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            Upload Icon
          </Motion.button>

          {/* File name */}
          <span
            className="text-sm text-gray-600 truncate max-w-[180px]"
            title={
              form.icon
                ? form.icon.name
                : form.oldIcon
                  ? form.oldIcon.replace(/^\d+-/, "")
                  : "No file selected"
            }
          >
            {form.icon
              ? form.icon.name
              : form.oldIcon
                ? form.oldIcon.replace(/^\d+-/, "")
                : ""}
          </span>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Motion.button
          whileHover={hover}
          whileTap={tap}
          onClick={cancel}
          className="border px-4 py-2 rounded-lg"
        >
          Cancel
        </Motion.button>
        <Motion.button
          whileHover={hover}
          whileTap={tap}
          onClick={() => submit(form)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Save
        </Motion.button>
      </div>
    </div>
  );
};

const ConfirmDelete = ({ name, confirm, cancel, type = "item" }) => (
  <div className="text-center space-y-5">
    {/* TITLE */}
    <h2 className="text-2xl font-semibold text-gray-900">Delete Skill?</h2>

    {/* MESSAGE */}
    <p className="text-gray-600 leading-relaxed">
      Are you sure you want to delete{" "}
      <span className="font-medium text-gray-900">{name}</span>?
      <br />
      This action cannot be undone.
    </p>

    {/* ACTIONS */}
    <div className="flex justify-center gap-4 pt-2">
      <Motion.button
        whileHover={hover}
        whileTap={tap}
        onClick={cancel}
        className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700"
      >
        Cancel
      </Motion.button>

      <Motion.button
        whileHover={hover}
        whileTap={tap}
        onClick={confirm}
        className="px-6 py-2 bg-red-600 text-white rounded-xl"
      >
        Delete
      </Motion.button>
    </div>
  </div>
);

export default EditSkills;
