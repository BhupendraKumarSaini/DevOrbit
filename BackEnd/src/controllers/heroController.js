import Hero from "../models/Hero.js";

/* GET */
export const getHero = async (req, res) => {
  try {
    const hero = await Hero.findOne();
    res.json(hero || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* PUT */
export const updateHero = async (req, res) => {
  try {
    const { name, role, headline } = req.body;

    const updateData = { name, role, headline };

    if (req.file) {
      updateData.profileImage = req.file.filename;
    }

    const hero = await Hero.findOneAndUpdate({}, updateData, {
      new: true,
      upsert: true,
    });

    res.json(hero);
  } catch (error) {
    console.error("Hero update error:", error);
    res.status(500).json({ message: "Failed to update hero" });
  }
};
