import About from "../models/About.js";

/* GET — Fetch About section */
export const getAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    res.json(about || {});
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch about section" });
  }
};

/* PUT — Update or create About section */
export const updateAbout = async (req, res) => {
  try {
    const { description } = req.body;

    const updateData = { description };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedAbout = await About.findOneAndUpdate({}, updateData, {
      new: true,
      upsert: true,
    });

    res.json(updatedAbout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update about section" });
  }
};
