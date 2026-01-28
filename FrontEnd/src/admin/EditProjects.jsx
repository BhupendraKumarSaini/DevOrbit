import React, { useEffect, useState, useRef } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { apiFetch } from "../lib/api";
import Modal from "../component/ui/Modal";
import toast from "react-hot-toast";
import { isEmpty, isValidURL, isValidImage } from "../utils/validators";
import { hover, tap } from "../animation/motion";
import { motion as Motion, AnimatePresence } from "framer-motion";

const API = import.meta.env.VITE_API_URL;

const EditProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [previewModal, setPreviewModal] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  const loadProjects = async () => {
    try {
      const data = await apiFetch("/api/projects");
      setProjects(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  /* SAVE (ADD / EDIT) */
  const submitProject = async (form, edit = false) => {
    if (isEmpty(form.title)) return toast.error("Title is required");
    if (isEmpty(form.summary)) return toast.error("Summary is required");
    if (!form.points.length)
      return toast.error("Add at least one bullet point");
    if (!form.techStack.length) return toast.error("Tech stack is required");

    if (!isValidURL(form.liveLink)) return toast.error("Invalid live link");

    if (form.thumbnail && !isValidImage(form.thumbnail))
      return toast.error("Invalid image");

    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("summary", form.summary);
      fd.append("points", JSON.stringify(form.points));
      fd.append("techStack", JSON.stringify(form.techStack));

      fd.append("liveLink", form.liveLink);
      fd.append("githubLink", form.githubLink || "");
      if (form.thumbnail) fd.append("thumbnail", form.thumbnail);

      await apiFetch(edit ? `/api/projects/${form.id}` : "/api/projects", {
        method: edit ? "PUT" : "POST",
        body: fd,
      });

      toast.success(edit ? "Project updated" : "Project added");
      setAddModal(false);
      setEditModal(null);
      loadProjects();
    } catch (e) {
      toast.error(e.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  /* DELETE */
  const deleteProject = async () => {
    await apiFetch(`/api/projects/${deleteModal.id}`, {
      method: "DELETE",
    });
    toast.success("Project deleted");
    setDeleteModal(null);
    loadProjects();
  };

  if (loading) return <p className="text-center mt-20">Loading…</p>;

  return (
    <>
      <section className="w-[80%] mx-auto font-[Poppins]">
        <h1 className="text-4xl text-center font-semibold mb-8">Projects</h1>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* ADD CARD */}
          <Motion.div
            whileHover={hover}
            whileTap={tap}
            onClick={() => setAddModal(true)}
            className="aspect-3/2 border-2 border-dashed border-blue-300 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer bg-blue-50/50 hover:bg-blue-50"
          >
            <Plus size={42} className="text-blue-600" />
            <p className="text-lg font-semibold text-blue-700">Add Project</p>
          </Motion.div>

          {/* PROJECT CARDS */}
          {projects.map((p) => (
            <Motion.div
              key={p._id}
              whileHover={hover}
              onClick={() => setPreviewModal(p)}
              className="cursor-pointer aspect-3/2 bg-white rounded-2xl overflow-hidden shadow-[0_12px_35px_rgba(0,0,0,0.14)] relative"
            >
              {/* ADMIN ACTIONS */}
              <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
                <Motion.button
                  whileHover={hover}
                  whileTap={tap}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditModal({ ...p, id: p._id });
                  }}
                  className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 shadow"
                >
                  <Pencil size={14} />
                </Motion.button>

                <Motion.button
                  whileHover={hover}
                  whileTap={tap}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteModal({ id: p._id, title: p.title });
                  }}
                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 shadow"
                >
                  <Trash2 size={14} />
                </Motion.button>
              </div>

              {/* THUMBNAIL */}
              <div className="h-[55%] w-full">
                <img
                  src={`${API}/uploads/projects/${p.thumbnail}`}
                  alt={p.title}
                  className="h-full w-full object-contain object-top"
                />
              </div>

              {/* CONTENT */}
              <div className="h-[45%] p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold leading-tight line-clamp-1">
                    {p.title}
                  </h3>

                  <p className="text-gray-600 mt-2 text-sm leading-relaxed line-clamp-2">
                    {p.summary}
                  </p>
                </div>

                {/* BUTTONS */}
                <div className="flex gap-3 pt-3">
                  {p.liveLink && (
                    <Motion.a
                      whileHover={hover}
                      whileTap={tap}
                      href={p.liveLink}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      className="px-4 py-1.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 mb-1"
                    >
                      Live
                    </Motion.a>
                  )}

                  {p.githubLink && (
                    <Motion.a
                      whileHover={hover}
                      whileTap={tap}
                      href={p.githubLink}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      className="px-4 py-1.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 mb-1"
                    >
                      GitHub
                    </Motion.a>
                  )}
                </div>
              </div>
            </Motion.div>
          ))}
        </div>
      </section>

      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {previewModal && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4"
          >
            <Motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className=" bg-white rounded-2xl max-w-3xl w-full max-h-[97vh] overflow-y-auto relative"
            >
              {/* HEADER IMAGE */}
              <div className="relative">
                <img
                  src={`${API}/uploads/projects/${previewModal.thumbnail}`}
                  alt={previewModal.title}
                  className="w-full object-cover object-top"
                />

                {/* CLOSE */}
                <Motion.button
                  whileHover={hover}
                  onClick={() => setPreviewModal(null)}
                  className="absolute top-2 right-2 cursor-pointer"
                >
                  <X size={25} />
                </Motion.button>
              </div>

              {/* CONTENT */}
              <div className="p-8">
                <h2 className="text-3xl font-semibold">{previewModal.title}</h2>

                <p className="text-gray-600 mt-3 leading-relaxed">
                  {previewModal.summary}
                </p>

                <div className="h-px bg-gray-200 my-6" />

                <ul className="list-disc ml-5 space-y-2 text-gray-700">
                  {previewModal.points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>

                <p className="mt-6 text-sm text-gray-700">
                  <strong>Tech:</strong> {previewModal.techStack.join(", ")}
                </p>

                <div className="flex gap-4 mt-8">
                  {previewModal.liveLink && (
                    <Motion.a
                      whileHover={hover}
                      whileTap={tap}
                      href={previewModal.liveLink}
                      target="_blank"
                      className="px-6 py-2 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Live
                    </Motion.a>
                  )}

                  {previewModal.githubLink && (
                    <Motion.a
                      whileHover={hover}
                      whileTap={tap}
                      href={previewModal.githubLink}
                      target="_blank"
                      className="px-6 py-2 rounded-xl text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      GitHub
                    </Motion.a>
                  )}
                </div>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* ADD / EDIT MODAL */}
      <Modal
        open={addModal || !!editModal}
        onClose={() => {
          setAddModal(false);
          setEditModal(null);
        }}
      >
        <ProjectForm
          data={editModal}
          saving={saving}
          submit={(f) => submitProject(f, !!editModal)}
          cancel={() => {
            setAddModal(false);
            setEditModal(null);
          }}
        />
      </Modal>

      {/* DELETE MODAL */}
      <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)}>
        <div className="text-center space-y-5">
          <h2 className="text-2xl font-semibold text-gray-900">
            Delete Project?
          </h2>

          <p className="text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-medium text-gray-900">
              {deleteModal?.title}
            </span>
            ?
            <br />
            This action cannot be undone.
          </p>

          <div className="flex justify-center gap-4 pt-2">
            <Motion.button
              whileHover={hover}
              whileTap={tap}
              onClick={() => setDeleteModal(null)}
              className="px-6 py-2 border rounded-xl"
            >
              Cancel
            </Motion.button>

            <Motion.button
              whileHover={hover}
              whileTap={tap}
              onClick={deleteProject}
              className="px-6 py-2 bg-red-600 text-white rounded-xl"
            >
              Delete
            </Motion.button>
          </div>
        </div>
      </Modal>
    </>
  );
};

/* PROJECT FORM */
const ProjectForm = ({ data = {}, submit, saving, cancel }) => {
  const fileRef = useRef();

  const [form, setForm] = useState({
    id: data?.id,
    title: data?.title || "",
    summary: data?.summary || "",
    points: data?.points || [],
    techStack: data?.techStack || [],
    liveLink: data?.liveLink || "",
    githubLink: data?.githubLink || "",
    thumbnail: null,
    thumbnailName: data?.thumbnail || "",
  });

  const addPoint = () => setForm({ ...form, points: [...form.points, ""] });

  const updatePoint = (i, v) => {
    const pts = [...form.points];
    pts[i] = v;
    setForm({ ...form, points: pts });
  };

  const removePoint = (i) =>
    setForm({
      ...form,
      points: form.points.filter((_, idx) => idx !== i),
    });

  return (
    <div className="flex flex-col max-h-[calc(100vh-6rem)]">
      {/* HEADER */}
      <h2 className="text-2xl font-semibold text-center mb-4 shrink-0">
        {data ? "Edit Project" : "Add Project"}
      </h2>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
        {/* TITLE */}
        <Input
          label="Project Title"
          placeholder="e.g. Portfolio Website"
          value={form.title}
          onChange={(v) => setForm({ ...form, title: v })}
        />

        {/* SUMMARY */}
        <div>
          <label className="block font-medium mb-1">Short Summary</label>
          <textarea
            rows={3}
            placeholder="Tell what this project does"
            className="w-full border rounded-xl p-3"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
          />
        </div>

        {/* BULLETS */}
        <div className="space-y-2">
          <label className="block font-medium">Bullet Points</label>

          {form.points.map((p, i) => (
            <div key={i} className="flex gap-2">
              <input
                placeholder={`Point ${i + 1}`}
                className="flex-1 border rounded-lg p-2"
                value={p}
                onChange={(e) => updatePoint(i, e.target.value)}
              />
              <button
                onClick={() => removePoint(i)}
                className="p-2 my-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <Motion.button
            whileHover={hover}
            whileTap={tap}
            onClick={addPoint}
            className="inline-flex items-center px-3 py-1.5 ml-1 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 w-fit"
          >
            + Add Point
          </Motion.button>
        </div>

        {/* TECH STACK */}
        <Input
          label="Tech Stack (comma separated)"
          placeholder="React, Tailwind, Node.js"
          value={form.techStack.join(", ")}
          onChange={(v) =>
            setForm({
              ...form,
              techStack: v.split(",").map((t) => t.trim()),
            })
          }
        />

        <Input
          label="Live URL"
          placeholder="https://yourproject.com"
          value={form.liveLink}
          onChange={(v) => setForm({ ...form, liveLink: v })}
        />

        <Input
          label="GitHub URL (optional)"
          placeholder="https://github.com/username/repo"
          value={form.githubLink}
          onChange={(v) => setForm({ ...form, githubLink: v })}
        />

        {/* THUMBNAIL */}
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <Motion.button
              whileHover={hover}
              whileTap={tap}
              onClick={() => fileRef.current.click()}
              className="border px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 ml-1"
            >
              Upload Image
            </Motion.button>

            {form.thumbnailName && (
              <span className="text-sm text-gray-600 truncate max-w-[220px]">
                {form.thumbnailName}
              </span>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;

              setForm({
                ...form,
                thumbnail: file,
                thumbnailName: file.name,
              });
            }}
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-end gap-4 pt-4 shrink-0">
        <Motion.button
          whileHover={hover}
          whileTap={tap}
          onClick={cancel}
          className="px-6 py-2 border rounded-lg text-gray-700"
        >
          Cancel
        </Motion.button>

        <Motion.button
          whileHover={hover}
          whileTap={tap}
          onClick={() => submit(form)}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </Motion.button>
      </div>
    </div>
  );
};

/* INPUT COMPONENT */
const Input = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded-xl p-3 placeholder:text-gray-400
      "
    />
  </div>
);

export default EditProjects;
