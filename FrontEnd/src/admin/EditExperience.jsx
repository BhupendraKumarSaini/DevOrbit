import React, { useEffect, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { motion as Motion } from "framer-motion";
import Modal from "../component/ui/Modal";
import { apiFetch } from "../lib/api";
import toast from "react-hot-toast";
import { fadeUp, hover, tap } from "../animation/motion";

const EditExperience = () => {
  const [list, setList] = useState([]);
  const [edit, setEdit] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    try {
      const data = await apiFetch("/api/experience");

      data.sort((a, b) => {
        const aDate = new Date(a.startDate || a.createdAt);
        const bDate = new Date(b.startDate || b.createdAt);
        return bDate - aDate;
      });

      setList(data);
    } catch {
      toast.error("Failed to load experience");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (form, isEdit) => {
    await apiFetch(isEdit ? `/api/experience/${form.id}` : "/api/experience", {
      method: isEdit ? "PUT" : "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });
    toast.success("Experience saved");
    setOpen(false);
    setEdit(null);
    load();
  };

  const remove = async (id) => {
    await apiFetch(`/api/experience/${id}`, { method: "DELETE" });
    toast.success("Experience deleted");
    load();
  };

  return (
    <section className="w-[90%] max-w-5xl mx-auto font-[Poppins] pb-16">
      <h1
        initial="hidden"
        animate="show"
        className="text-center text-4xl font-semibold mb-10"
      >
        Work <span className="text-blue-600">Experience</span>
      </h1>

      <div className="space-y-6">
        {/* ADD CARD */}
        <Motion.div
          whileHover={hover}
          whileTap={tap}
          onClick={() => {
            setEdit(null);
            setOpen(true);
          }}
          className="w-full border-2 border-dashed border-blue-300 rounded-2xl p-8 flex items-center justify-center gap-4 cursor-pointer bg-blue-50/50 hover:bg-blue-50"
        >
          <Plus size={40} className="text-blue-600" />
          <span className="text-lg font-semibold text-blue-700">
            Add Experience
          </span>
        </Motion.div>

        {/* EXPERIENCE LIST */}
        {list.map((e) => (
          <Motion.div
            key={e._id}
            whileHover={hover}
            className="relative bg-white border border-gray-200 rounded-2xl p-6 shadow"
          >
            {/* ACTIONS */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Motion.button
                whileHover={hover}
                whileTap={tap}
                onClick={() => {
                  setEdit(e);
                  setOpen(true);
                }}
                className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer"
              >
                <Pencil size={16} />
              </Motion.button>

              <Motion.button
                whileHover={hover}
                whileTap={tap}
                onClick={() => setDeleteTarget(e)}
                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer"
              >
                <Trash2 size={16} />
              </Motion.button>
            </div>

            {/* CONTENT */}
            <h3 className="text-xl font-semibold text-gray-900">
              {e.role} — {e.company}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {e.startDate} – {e.endDate} | {e.location}
            </p>

            <ul className="list-disc ml-5 mt-4 space-y-1 text-gray-700">
              {e.points.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </Motion.div>
        ))}
      </div>

      {/* ADD / EDIT MODAL */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <ExperienceForm
          data={edit}
          submit={save}
          cancel={() => setOpen(false)}
        />
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <div className="text-center space-y-5">
          <h2 className="text-2xl font-semibold text-gray-900">
            Delete Experience?
          </h2>

          <p className="text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-medium">{deleteTarget?.role}</span> at{" "}
            <span className="font-medium">{deleteTarget?.company}</span>?
            <br />
            This action cannot be undone.
          </p>

          <div className="flex justify-center gap-4 pt-2">
            <Motion.button
              whileHover={hover}
              whileTap={tap}
              onClick={() => setDeleteTarget(null)}
              className="px-6 py-2 border rounded-xl"
            >
              Cancel
            </Motion.button>

            <Motion.button
              whileHover={hover}
              whileTap={tap}
              onClick={() => {
                remove(deleteTarget._id);
                setDeleteTarget(null);
              }}
              className="px-6 py-2 bg-red-600 text-white rounded-xl"
            >
              Delete
            </Motion.button>
          </div>
        </div>
      </Modal>
    </section>
  );
};

const ExperienceForm = ({ data = {}, submit, cancel }) => {
  const [form, setForm] = useState({
    id: data?._id,
    role: data?.role || "",
    company: data?.company || "",
    location: data?.location || "",
    startDate: data?.startDate || "",
    endDate: data?.endDate || "",
    points: data?.points?.join("\n") || "",
  });

  return (
    <div className="flex flex-col max-h-[calc(100vh-6rem)]">
      {/* HEADER */}
      <h2 className="text-2xl font-semibold text-center mb-4 shrink-0">
        {form.id ? "Edit Experience" : "Add Experience"}
      </h2>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Role"
            placeholder="e.g. Frontend Developer"
            value={form.role}
            onChange={(v) => setForm({ ...form, role: v })}
          />

          <Input
            label="Company"
            placeholder="e.g. Google"
            value={form.company}
            onChange={(v) => setForm({ ...form, company: v })}
          />

          <Input
            label="Location"
            placeholder="e.g. Bengaluru, India"
            value={form.location}
            onChange={(v) => setForm({ ...form, location: v })}
          />

          <Input
            label="Start Date"
            placeholder="e.g. Jan 2025"
            value={form.startDate}
            onChange={(v) => setForm({ ...form, startDate: v })}
          />

          <Input
            label="End Date"
            placeholder="e.g. Present"
            value={form.endDate}
            onChange={(v) => setForm({ ...form, endDate: v })}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Responsibilities / Achievements
          </label>
          <textarea
            rows={6}
            placeholder="One bullet per line"
            className="w-full border rounded-xl p-3"
            value={form.points}
            onChange={(e) => setForm({ ...form, points: e.target.value })}
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-end gap-4 pt-4 shrink-0">
        <Motion.button
          whileHover={hover}
          whileTap={tap}
          onClick={cancel}
          className="px-6 py-2 border rounded-xl"
        >
          Cancel
        </Motion.button>

        <Motion.button
          whileHover={hover}
          whileTap={tap}
          onClick={() =>
            submit(
              {
                role: form.role.trim(),
                company: form.company.trim(),
                location: form.location.trim(),
                startDate: form.startDate.trim(),
                endDate: form.endDate.trim(),
                points: form.points
                  .split("\n")
                  .map((p) => p.trim())
                  .filter(Boolean),
                id: form.id,
              },
              !!form.id,
            )
          }
          className="px-6 py-2 bg-blue-600 text-white rounded-xl"
        >
          Save
        </Motion.button>
      </div>
    </div>
  );
};

const Input = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded-xl p-3 placeholder:text-gray-400"
    />
  </div>
);

export default EditExperience;
