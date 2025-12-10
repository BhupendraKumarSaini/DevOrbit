import About from "../models/About.js";

// GET — Fetch
export const getAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    res.json(about || {});
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch about section" });
  }
};

// PUT — Update or Create
export const updateAbout = async (req, res) => {
  try {
    const { description } = req.body;

    const updateData = { description };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updated = await About.findOneAndUpdate({}, updateData, {
      new: true,
      upsert: true,
    });

    res.json(updated);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update about section" });
  }
};
