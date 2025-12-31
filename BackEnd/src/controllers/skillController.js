import Skill from "../models/Skill.js";

/* GET — Fetch all skills */
export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    return res.json(skills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load skills" });
  }
};

/* POST — Add a new skill */
export const addSkill = async (req, res) => {
  try {
    const { name, color } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Icon is required" });
    }

    const skill = new Skill({
      name,
      color,
      icon: req.file.filename,
    });

    await skill.save();

    res.json({ message: "Skill added", skill });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add skill" });
  }
};

/* PUT — Update a skill */
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    const updateData = { name, color };

    if (req.file) {
      updateData.icon = req.file.filename;
    }

    const updatedSkill = await Skill.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.json({ message: "Skill updated", updated: updatedSkill });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update skill" });
  }
};

/* DELETE — Remove a skill */
export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    await Skill.findByIdAndDelete(id);

    res.json({ message: "Skill deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete skill" });
  }
};
