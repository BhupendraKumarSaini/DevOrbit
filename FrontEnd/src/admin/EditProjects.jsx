import React, { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Pencil, X } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const EditProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Popups */
  const [previewModal, setPreviewModal] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  /* Fetch Projects */
  const loadProjects = async () => {
    try {
      const res = await fetch(`${API}/api/projects`);
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  /* ADD PROJECT */
  const handleAddProject = async (form) => {
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("link", form.link);
    if (form.thumbnail) fd.append("thumbnail", form.thumbnail);

    await fetch(`${API}/api/projects`, {
      method: "POST",
      body: fd,
    });

    setAddModal(false);
    loadProjects();
  };

  /* EDIT PROJECT */
  const handleEditProject = async (form) => {
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

  /* DELETE PROJECT */
  const handleDeleteProject = async () => {
    await fetch(`${API}/api/projects/${deleteModal.id}`, {
      method: "DELETE",
    });

    setDeleteModal(null);
    loadProjects();
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <>
      <section
        id="projects"
        className="pt-20 w-[95%] sm:w-[85%] md:w-[80%] lg:w-[70%] mx-auto font-[Poppins] mb-5"
      >
        <Motion.h1
          initial={{ y: -40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center text-5xl font-semibold text-blue-700 mb-10"
        >
          Projects
        </Motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
          {/* ADD BUTTON CARD */}
          <Motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ duration: 0.35 }}
            onClick={() => setAddModal(true)}
            className="border border-gray-200 rounded-2xl p-5 bg-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.1)] flex flex-col justify-center items-center hover:shadow-[0_12px_35px_rgba(0,0,0,0.15)] cursor-pointer"
          >
            <Plus size={45} className="text-blue-600 mb-2" />
            <p className="text-xl font-semibold text-black">Add Project</p>
          </Motion.div>

          {projects.map((p, i) => (
            <Motion.div
              key={p._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="relative border border-gray-200 p-5 rounded-2xl bg-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.15)] cursor-pointer"
              onClick={() => setPreviewModal(p)}
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
                className="absolute top-0 right-0 p-2  text-blue-700 rounded-full hover:bg-gray-200 hover:cursor-pointer"
              >
                <Pencil size={15} />
              </button>

              {/* DELETE */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteModal({
                    id: p._id,
                    title: p.title,
                  });
                }}
                className="absolute top-7 right-0 p-2  text-red-700 rounded-full hover:bg-gray-200 hover:cursor-pointer"
              >
                <Trash2 size={15} />
              </button>

              <img
                src={`${API}/uploads/projects/${p.thumbnail}`}
                className="rounded-xl w-full mb-4 object-cover"
              />
              <p className="text-xl font-semibold text-black mb-1">{p.title}</p>
              <p className="line-clamp-2 text-gray-600 mb-4">{p.description}</p>

              <Motion.a
                onClick={(e) => e.stopPropagation()}
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 py-2 px-5 rounded-lg text-white hover:bg-blue-700 shadow-[0_4px_6px_rgba(0,0,0,0.3)]"
                whileHover={{ scale: 1.06, opacity: 0.9 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              >
                Visit Site
              </Motion.a>
            </Motion.div>
          ))}
        </div>
      </section>

      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {previewModal && (
          <Motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-5 font-[Poppins]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewModal(null)}
          >
            <style>{`
        .hide-scrollbar-desktop::-webkit-scrollbar { display: none; }
        .hide-scrollbar-desktop { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
            <Motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-2xl p-4 sm:p-6 w-[95%] sm:w-[500px] md:w-[650px] max-h-[99vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* CLOSE BUTTON */}
              <button
                className="absolute top-4 right-4 text-2xl hover:cursor-pointer"
                onClick={() => setPreviewModal(null)}
              >
                ✖
              </button>

              {/* IMAGE */}
              <img
                src={`${API}/uploads/projects/${previewModal.thumbnail}`}
                alt={previewModal.title}
                className="w-full rounded-xl mb-3 sm:mb-4 object-contain max-h-[40vh] sm:max-h-[40vh] md:max-h-[280px]"
              />

              {/* TITLE */}
              <h3 className="text-2xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
                {previewModal.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="mt-1 sm:mt-2 text-gray-700 leading-relaxed">
                {previewModal.description}
              </p>

              {/* VISIT BUTTON */}
              <Motion.a
                whileHover={{
                  scale: 1.06,
                  boxShadow: "0px 10px 25px rgba(0,0,0,0.25)",
                }}
                whileTap={{ scale: 0.95 }}
                href={previewModal.link}
                target="_blank"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded mt-3 mr-auto shadow-[0_4px_6px_rgba(0,0,0,0.3)]"
              >
                Visit Site
              </Motion.a>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* ADD MODAL */}
      {addModal && (
        <ModalWrapper onClose={() => setAddModal(false)}>
          <ProjectForm
            title="Add Project"
            submit={(data) => handleAddProject(data)}
            cancel={() => setAddModal(false)}
          />
        </ModalWrapper>
      )}

      {/* EDIT MODAL */}
      {editModal && (
        <ModalWrapper onClose={() => setEditModal(null)}>
          <ProjectForm
            title="Edit Project"
            formData={editModal}
            submit={(data) => handleEditProject(data)}
            cancel={() => setEditModal(null)}
            editMode
          />
        </ModalWrapper>
      )}

      {/* DELETE MODAL */}
      {deleteModal && (
        <ModalWrapper onClose={() => setDeleteModal(null)}>
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Delete Project?</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete{" "}
              <span className="text-red-600 font-semibold">
                {deleteModal.title}
              </span>
              ?
            </p>

            <div className="flex justify-center gap-4">
              <Motion.button
                whileHover={{ scale: 1.05, opacity: 0.9 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                onClick={() => setDeleteModal(null)}
                className="px-6 py-2 border rounded-lg hover:bg-gray-100 hover:cursor-pointer"
              >
                Cancel
              </Motion.button>
              <Motion.button
                onClick={handleDeleteProject}
                whileHover={{ scale: 1.05, x: [0, -2, 2, -2, 2, 0] }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
              >
                Delete
              </Motion.button>
            </div>
          </div>
        </ModalWrapper>
      )}
    </>
  );
};

/* UNIVERSAL MODAL WRAPPER */
const ModalWrapper = ({ children, onClose }) => (
  <Motion.div
    className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm px-2 sm:px-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <Motion.div
      className="bg-white w-full max-w-[680px] rounded-2xl p-4 sm:p-6 relative max-h-[99vh] font-[Poppins]"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </Motion.div>
  </Motion.div>
);

/* FORM COMPONENT */
const ProjectForm = ({ title, formData = {}, submit, cancel, editMode }) => {
  const [form, setForm] = useState({
    id: formData.id || "",
    title: formData.title || "",
    description: formData.description || "",
    link: formData.link || "",
    thumbnail: null,
    oldThumbnail: formData.oldThumbnail || "",
  });

  return (
    <div className="flex flex-col gap-3 max-h-[99vh] min-h-screen w-full pr-1">
      <h2 className="text-3xl font-semibold text-center">{title}</h2>

      <InputField
        label="Title"
        value={form.title}
        onChange={(val) => setForm({ ...form, title: val })}
      />
      <TextAreaField
        label="Description"
        value={form.description}
        onChange={(val) => setForm({ ...form, description: val })}
      />
      <InputField
        label="Project Link"
        value={form.link}
        onChange={(val) => setForm({ ...form, link: val })}
      />

      {/* UPLOAD */}
      <div className="flex items-center gap-4">
        <Motion.label
          htmlFor="thumbInput"
          whileHover={{ scale: 1.05, opacity: 0.9 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="cursor-pointer bg-gray-800 text-white px-5 py-3 rounded-xl hover:bg-gray-900"
        >
          Upload Thumbnail
        </Motion.label>

        <input
          id="thumbInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setForm({ ...form, thumbnail: e.target.files[0] })}
        />

        {form.thumbnail ? (
          <p>{form.thumbnail.name}</p>
        ) : editMode ? (
          <p className="text-gray-500">{form.oldThumbnail}</p>
        ) : null}
      </div>

      <div className="flex justify-end gap-4 mt-1">
        <Motion.button
          onClick={cancel}
          whileHover={{ scale: 1.05, opacity: 0.9 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="px-6 py-3 border rounded-lg hover:bg-gray-100 cursor-pointer"
        >
          Cancel
        </Motion.button>

        <Motion.button
          onClick={() => submit(form)}
          whileHover={{ scale: 1.05, opacity: 0.95 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
        >
          Save
        </Motion.button>
      </div>
    </div>
  );
};

/* Small Reusable Fields */
const InputField = ({ label, value, onChange }) => (
  <div>
    <label className="font-medium">{label}</label>
    <Motion.input
      whileFocus={{ scale: 1.03 }}
      className="w-full border p-3 rounded-lg mt-1 cursor-pointer"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const TextAreaField = ({ label, value, onChange }) => (
  <div>
    <label className="font-medium">{label}</label>
    <Motion.textarea
      rows={4}
      whileFocus={{ scale: 1.03 }}
      className="w-full border p-3 rounded-lg mt-1 cursor-pointer"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default EditProjects;
