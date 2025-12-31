import Hero from "../models/Hero.js";

/* GET — Fetch Hero section */
export const getHero = async (req, res) => {
  try {
    const hero = await Hero.findOne();
    res.json(hero || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* PUT — Update or create Hero section */
export const updateHero = async (req, res) => {
  try {
    const { name, title, description } = req.body;

    const updateData = {
      name,
      title,
      description,
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedHero = await Hero.findOneAndUpdate({}, updateData, {
      new: true,
      upsert: true,
    });

    res.json(updatedHero);
  } catch (error) {
    console.error("Hero Update Error:", error);
    res.status(500).json({ error: error.message });
  }
};
