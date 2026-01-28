import Experience from "../models/Experience.js";

/* GET */
export const getExperiences = async (req, res) => {
  try {
    const data = await Experience.find().sort({ createdAt: -1 });
    res.json(data);
  } catch {
    res.status(500).json({ message: "Failed to load experience" });
  }
};

/* POST */
export const addExperience = async (req, res) => {
  try {
    const { role, company, startDate, points } = req.body;

    if (!role || !company || !startDate || !Array.isArray(points)) {
      return res.status(400).json({ message: "Invalid experience data" });
    }

    const exp = await Experience.create(req.body);
    res.json(exp);
  } catch (err) {
    res.status(500).json({ message: "Failed to add experience" });
  }
};

/* PUT */
export const updateExperience = async (req, res) => {
  try {
    const { points } = req.body;

    if (points && !Array.isArray(points)) {
      return res.status(400).json({ message: "Points must be an array" });
    }

    const updated = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    res.json(updated);
  } catch {
    res.status(500).json({ message: "Failed to update experience" });
  }
};

/* DELETE */
export const deleteExperience = async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ message: "Experience deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete experience" });
  }
};
