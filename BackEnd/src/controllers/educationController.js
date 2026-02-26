import Education from "../models/Education.js";

export const getEducation = async (_, res) => {
  const data = await Education.find().sort({ startYear: -1 });
  res.json(data);
};

export const addEducation = async (req, res) => {
  const edu = new Education(req.body);
  await edu.save();
  res.json(edu);
};

export const updateEducation = async (req, res) => {
  const { id } = req.params;
  const edu = await Education.findByIdAndUpdate(id, req.body, { new: true });
  res.json(edu);
};

export const deleteEducation = async (req, res) => {
  await Education.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
