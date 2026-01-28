import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { apiFetch } from "../lib/api";
import Modal from "../component/ui/Modal";
import toast from "react-hot-toast";
import { hover, tap } from "../animation/motion";
import { motion as Motion } from "framer-motion";
import { isEmpty, isValidURL } from "../utils/validators";

const EditEducationCerts = () => {
  const [tab, setTab] = useState("education");
  const [education, setEducation] = useState([]);
  const [certs, setCerts] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [modal, setModal] = useState(null);

  const load = async () => {
    const [edu, cert] = await Promise.all([
      apiFetch("/api/education"),
      apiFetch("/api/certifications"),
    ]);
    setEducation(edu);
    setCerts(cert);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (type, data) => {
    const id = data._id || data.id;

    if (isEmpty(data.title || data.degree)) {
      return toast.error("All required fields must be filled");
    }

    const { _id, id: _, ...payload } = data;

    try {
      await apiFetch(
        id
          ? `/api/${type === "edu" ? "education" : "certifications"}/${id}`
          : `/api/${type === "edu" ? "education" : "certifications"}`,
        {
          method: id ? "PUT" : "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        },
      );

      toast.success("Saved");
      setModal(null);
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const remove = async (type, id) => {
    await apiFetch(
      `/api/${type === "edu" ? "education" : "certifications"}/${id}`,
      { method: "DELETE" },
    );
    toast.success("Deleted");
    load();
  };

  return (
    <section className="w-[80%] mx-auto font-[Poppins] pb-16">
      <h1 className="text-4xl font-semibold text-center mb-8">
        Education & <span className="text-blue-600">Certifications</span>
      </h1>

      {/* TABS */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex bg-gray-100 rounded-2xl p-1">
          {["education", "certifications"].map((t) => (
            <Motion.button
              key={t}
              whileHover={hover}
              whileTap={tap}
              onClick={() => setTab(t)}
              className={`px-6 py-2 rounded-xl text-sm font-medium
          ${
            tab === t
              ? "bg-white text-blue-600 shadow"
              : "text-gray-600 hover:text-gray-900"
          }
        `}
            >
              {t === "education" ? "Education" : "Certifications"}
            </Motion.button>
          ))}
        </div>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Motion.div
          whileHover={hover}
          whileTap={tap}
          onClick={() => setModal({ type: tab, data: {} })}
          className="min-h-40 border-2 border-dashed border-blue-300 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer bg-blue-50/50 hover:bg-blue-50"
        >
          <Plus size={34} className="text-blue-600" />
          <span className="text-base font-semibold text-blue-700">
            Add {tab === "education" ? "Education" : "Certification"}
          </span>
        </Motion.div>

        {/* CARDS */}
        {(tab === "education" ? education : certs).slice().map((item) => (
          <EducationCertCard
            key={item._id}
            item={item}
            type={tab}
            onEdit={() => setModal({ type: tab, data: item })}
            onDelete={() =>
              setDeleteTarget({
                type: tab,
                id: item._id,
                title: tab === "education" ? item.degree : item.title,
              })
            }
          />
        ))}
      </div>
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <div className="text-center space-y-5">
          <h2 className="text-2xl font-semibold text-gray-900">
            Delete {tab === "education" ? "Education" : "Certification"}?
          </h2>

          <p className="text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-medium text-gray-900">
              {deleteTarget?.title}
            </span>
            ?
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
                remove(
                  deleteTarget.type === "education" ? "edu" : "cert",
                  deleteTarget.id,
                );
                setDeleteTarget(null);
              }}
              className="px-6 py-2 bg-red-600 text-white rounded-xl"
            >
              Delete
            </Motion.button>
          </div>
        </div>
      </Modal>

      {/* MODAL */}
      <Modal open={!!modal} onClose={() => setModal(null)}>
        <Form
          type={modal?.type}
          data={modal?.data}
          submit={save}
          cancel={() => setModal(null)}
        />
      </Modal>
    </section>
  );
};

const EducationCertCard = ({ item, type, onEdit, onDelete }) => {
  return (
    <Motion.div
      whileHover={hover}
      className="bg-white border border-gray-200 rounded-2xl p-6 shadow min-h-40 flex flex-col"
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-900 leading-snug">
          {type === "education" ? item.degree : item.title}
        </h3>

        {/* ACTIONS */}
        <div className="flex gap-2 shrink-0">
          <Motion.button
            whileHover={hover}
            whileTap={tap}
            onClick={onEdit}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            <Pencil size={14} />
          </Motion.button>

          <Motion.button
            whileHover={hover}
            whileTap={tap}
            onClick={onDelete}
            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
          >
            <Trash2 size={14} />
          </Motion.button>
        </div>
      </div>

      {/* BODY */}
      <div className="mt-3 space-y-1">
        {type === "education" ? (
          <>
            <p className="text-gray-700">
              {item.institute}
              {item.location && ` – ${item.location}`}
            </p>

            <p className="text-sm text-gray-500">
              {item.startYear} – {item.endYear}
            </p>
          </>
        ) : (
          <>
            <p className="text-gray-700">{item.issuer}</p>
            <p className="text-sm text-gray-500">{item.year}</p>
          </>
        )}
      </div>
    </Motion.div>
  );
};

const Form = ({ type, data = {}, submit, cancel }) => {
  const [form, setForm] = useState(data);

  return (
    <div className="flex flex-col max-h-[calc(100vh-6rem)]">
      {/* HEADER */}
      <h2 className="text-2xl font-semibold text-center mb-4 shrink-0">
        {data._id ? "Edit" : "Add"}{" "}
        {type === "education" ? "Education" : "Certification"}
      </h2>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
        {type === "education" ? (
          <>
            <Input
              label="Degree"
              placeholder="e.g. Bachelor of Technology"
              value={form.degree || ""}
              onChange={(v) => setForm({ ...form, degree: v })}
            />

            <Input
              label="Institute"
              placeholder="e.g. Delhi Technological University"
              value={form.institute || ""}
              onChange={(v) => setForm({ ...form, institute: v })}
            />

            <Input
              label="Location"
              placeholder="e.g. New Delhi, India"
              value={form.location || ""}
              onChange={(v) => setForm({ ...form, location: v })}
            />

            <Input
              label="Start Year"
              placeholder="2022"
              value={form.startYear || ""}
              onChange={(v) => setForm({ ...form, startYear: v })}
            />

            <Input
              label="End Year"
              placeholder="2025"
              value={form.endYear || ""}
              onChange={(v) => setForm({ ...form, endYear: v })}
            />
          </>
        ) : (
          <>
            <Input
              label="Title"
              placeholder="e.g. Full Stack Web Development"
              value={form.title || ""}
              onChange={(v) => setForm({ ...form, title: v })}
            />

            <Input
              label="Issuer"
              placeholder="e.g. Coursera / Google"
              value={form.issuer || ""}
              onChange={(v) => setForm({ ...form, issuer: v })}
            />

            <Input
              label="Year"
              placeholder="2025"
              value={form.year || ""}
              onChange={(v) => setForm({ ...form, year: v })}
            />
          </>
        )}
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
          onClick={() => submit(type === "education" ? "edu" : "cert", form)}
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
      className="w-full border rounded-xl p-3"
    />
  </div>
);

export default EditEducationCerts;
