import About from "../models/About.js";

/* GET */
export const getAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    res.json(about || { points: [] });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch about section" });
  }
};

/* PUT */
export const updateAbout = async (req, res) => {
  try {
    const { points } = req.body;

    if (!Array.isArray(points) || points.length < 2) {
      return res
        .status(400)
        .json({ message: "At least 2 points are required" });
    }

    const updated = await About.findOneAndUpdate(
      {},
      { points },
      { new: true, upsert: true },
    );

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update about section" });
  }
};
