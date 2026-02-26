import Certification from "../models/Certification.js";

export const getCertifications = async (_, res) => {
  const data = await Certification.find().sort({ year: -1 });
  res.json(data);
};

export const addCertification = async (req, res) => {
  const cert = new Certification(req.body);
  await cert.save();
  res.json(cert);
};

export const updateCertification = async (req, res) => {
  const { id } = req.params;

  const { _id, ...updateData } = req.body;

  const cert = await Certification.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  res.json(cert);
};

export const deleteCertification = async (req, res) => {
  await Certification.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
