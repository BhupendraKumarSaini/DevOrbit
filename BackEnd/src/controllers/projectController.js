import Project from "../models/Project.js";
import fs from "fs";
import path from "path";

const uploadsPath = path.resolve("src/uploads/projects");

// Get All
export const getProjects = async (req, res) => {
  try {
    const data = await Project.find();
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Create
export const createProject = async (req, res) => {
  try {
    const { title, description, link } = req.body;

    const newProject = new Project({
      title,
      description,
      link,
      thumbnail: req.file ? req.file.filename : null,
    });

    await newProject.save();
    return res.json({ success: true, project: newProject });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Update
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Not found" });

    const { title, description, link } = req.body;

    project.title = title;
    project.description = description;
    project.link = link;

    // If new thumbnail uploaded
    if (req.file) {
      // remove old image
      if (project.thumbnail) {
        const oldPath = `${uploadsPath}/${project.thumbnail}`;
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      project.thumbnail = req.file.filename;
    }

    await project.save();

    return res.json({ success: true, project });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    // Delete thumbnail if exists
    if (project.thumbnail) {
      const filePath = `${uploadsPath}/${project.thumbnail}`;
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Project.findByIdAndDelete(id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
