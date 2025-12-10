import Skill from "../models/Skill.js";

/* GET ALL SKILLS */
export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    return res.json(skills);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to load skills" });
  }
};

/* ADD SKILL */
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
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add skill" });
  }
};

/* UPDATE SKILL */
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    let updateObj = { name, color };

    if (req.file) {
      updateObj.icon = req.file.filename;
    }

    const updated = await Skill.findByIdAndUpdate(id, updateObj, {
      new: true,
    });

    res.json({ message: "Skill updated", updated });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update skill" });
  }
};

/* DELETE SKILL */
export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    await Skill.findByIdAndDelete(id);
    res.json({ message: "Skill deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete skill" });
  }
};
