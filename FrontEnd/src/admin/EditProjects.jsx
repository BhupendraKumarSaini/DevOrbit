import React, { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Pencil, X } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const EditProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal states
  const [previewModal, setPreviewModal] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  /* LOAD PROJECTS */
  const loadProjects = async () => {
    try {
      const res = await fetch(`${API}/api/projects`);
      setProjects(await res.json());
    } catch (e) {
      console.error("Failed to load projects", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  /* ADD */
  const addProject = async (form) => {
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("link", form.link);
    if (form.thumbnail) fd.append("thumbnail", form.thumbnail);

    await fetch(`${API}/api/projects`, { method: "POST", body: fd });
    setAddModal(false);
    loadProjects();
  };

  /* EDIT */
  const editProject = async (form) => {
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("link", form.link);
    if (form.thumbnail) fd.append("thumbnail", form.thumbnail);

    await fetch(`${API}/api/projects/${form.id}`, {
      method: "PUT",
      body: fd,
    });

    setEditModal(null);
    loadProjects();
  };

  /* DELETE */
  const deleteProject = async () => {
    await fetch(`${API}/api/projects/${deleteModal.id}`, {
      method: "DELETE",
    });
    setDeleteModal(null);
    loadProjects();
  };

  if (loading) {
    return <p className="text-center mt-20">Loading projects…</p>;
  }

  return (
    <>
      <section className="w-[80%] mx-auto font-[Poppins]">
        <h1 className="text-center text-4xl font-semibold mb-8">Projects</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* ADD CARD */}
          <div
            onClick={() => setAddModal(true)}
            className="min-h-[260px] rounded-2xl border bg-white flex flex-col items-center justify-center cursor-pointer shadow hover:shadow-lg transition"
          >
            <Plus size={42} className="text-blue-600 mb-2" />
            <p className="font-semibold text-lg">Add Project</p>
          </div>

          {/* PROJECT CARDS */}
          {projects.map((p) => (
            <div
              key={p._id}
              onClick={() => setPreviewModal(p)}
              className="relative min-h-[260px] rounded-2xl border bg-white p-4 cursor-pointer shadow hover:shadow-lg transition flex flex-col"
            >
              {/* EDIT */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditModal({
                    id: p._id,
                    title: p.title,
                    description: p.description,
                    link: p.link,
                    oldThumbnail: p.thumbnail,
                  });
                }}
                className="absolute top-3 right-3"
              >
                <Pencil size={14} />
              </button>

              {/* DELETE */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteModal({ id: p._id, title: p.title });
                }}
                className="absolute top-9 right-3 text-red-600"
              >
                <Trash2 size={14} />
              </button>

              <img
                src={`${API}/uploads/projects/${p.thumbnail}`}
                alt={p.title}
                className="rounded-xl mb-3 w-full object-contain max-h-40"
              />

              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="text-gray-600 line-clamp-2 mb-3">{p.description}</p>

              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-auto inline-block bg-blue-600 text-white px-5 py-2 rounded-lg w-fit"
              >
                Visit Site
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {previewModal && (
          <Modal onClose={() => setPreviewModal(null)}>
            <img
              src={`${API}/uploads/projects/${previewModal.thumbnail}`}
              className="rounded-xl mb-4 w-full max-h-[280px] object-contain"
            />
            <h2 className="text-2xl font-semibold mb-2">
              {previewModal.title}
            </h2>
            <p className="text-gray-700 mb-4">{previewModal.description}</p>
            <a
              href={previewModal.link}
              target="_blank"
              className="bg-blue-600 text-white px-5 py-3 rounded-lg"
            >
              Visit Site
            </a>
          </Modal>
        )}
      </AnimatePresence>

      {/* ADD MODAL */}
      {addModal && (
        <Modal onClose={() => setAddModal(false)}>
          <ProjectForm
            title="Add Project"
            submit={addProject}
            cancel={() => setAddModal(false)}
          />
        </Modal>
      )}

      {/* EDIT MODAL */}
      {editModal && (
        <Modal onClose={() => setEditModal(null)}>
          <ProjectForm
            title="Edit Project"
            formData={editModal}
            submit={editProject}
            cancel={() => setEditModal(null)}
          />
        </Modal>
      )}

      {/* DELETE MODAL */}
      {deleteModal && (
        <Modal onClose={() => setDeleteModal(null)}>
          <div className="text-center space-y-4">
            {/* Title */}
            <h2 className="text-2xl font-semibold text-red-600">
              Delete Project
            </h2>

            {/* Warning text */}
            <p className="text-gray-700">
              Are you sure you want to delete the project
              <span className="font-semibold text-gray-900">
                {" "}
                “{deleteModal.title}”
              </span>
              ?
            </p>
            {/* Actions */}
            <div className="flex justify-center gap-4 pt-2">
              <button
                onClick={() => setDeleteModal(null)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={deleteProject}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete Project
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

/* MODAL */
const Modal = ({ children, onClose }) => (
  <div
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    onClick={onClose}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white rounded-2xl p-6 max-w-2xl w-full relative"
    >
      <button onClick={onClose} className="absolute top-4 right-4">
        <X />
      </button>
      {children}
    </div>
  </div>
);

/* FORM */
const ProjectForm = ({ title, formData = {}, submit, cancel }) => {
  const [form, setForm] = useState({
    id: formData.id || "",
    title: formData.title || "",
    description: formData.description || "",
    link: formData.link || "",
    thumbnail: null,
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-center">{title}</h2>

      <input
        className="w-full border p-3 rounded"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        rows={4}
        className="w-full border p-3 rounded"
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
        className="w-full border p-3 rounded"
        placeholder="Project link"
        value={form.link}
        onChange={(e) => setForm({ ...form, link: e.target.value })}
      />

      <input
        type="file"
        onChange={(e) => setForm({ ...form, thumbnail: e.target.files?.[0] })}
      />

      <div className="flex justify-end gap-4">
        <button onClick={cancel} className="border px-5 py-2 rounded">
          Cancel
        </button>
        <button
          onClick={() => submit(form)}
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditProjects;
