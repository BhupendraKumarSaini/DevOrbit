import Hero from "../models/Hero.js";

export const getHero = async (req, res) => {
  try {
    const hero = await Hero.findOne();
    res.json(hero || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateHero = async (req, res) => {
  try {
    const { name, title, description } = req.body;

    const update = {
      name,
      title,
      description,
    };

    if (req.file) {
      update.image = req.file.filename;
    }

    const updated = await Hero.findOneAndUpdate({}, update, {
      new: true,
      upsert: true,
    });

    res.json(updated);
  } catch (err) {
    console.error("Hero Update Error:", err);
    res.status(500).json({ error: err.message });
  }
};
