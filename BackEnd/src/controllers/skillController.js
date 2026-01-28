import Skill from "../models/Skill.js";
import fs from "fs";
import path from "path";

const skillsPath = path.resolve("src/uploads/skills");

/* GET */
export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.json(skills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load skills" });
  }
};

/* POST */
export const addSkill = async (req, res) => {
  try {
    const { name, category, color } = req.body;

    if (!name || !category || !color) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Icon is required" });
    }

    const skill = new Skill({
      name,
      category,
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

/* PUT */
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, color } = req.body;

    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    skill.name = name;
    skill.category = category;
    skill.color = color;

    if (req.file) {
      // delete old icon
      const oldPath = path.join(skillsPath, skill.icon);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

      skill.icon = req.file.filename;
    }

    await skill.save();
    res.json({ message: "Skill updated", skill });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update skill" });
  }
};

/* DELETE */
export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    // delete icon file
    const filePath = path.join(skillsPath, skill.icon);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await Skill.findByIdAndDelete(id);
    res.json({ message: "Skill deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete skill" });
  }
};
