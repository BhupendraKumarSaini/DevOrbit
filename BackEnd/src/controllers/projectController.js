import Project from "../models/Project.js";
import fs from "fs";
import path from "path";

const uploadsPath = path.resolve("src/uploads/projects");

/* GET — Fetch all projects */
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    return res.json(projects);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

/* POST — Create a new project */
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
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

/* PUT — Update a project */
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Not found" });
    }

    const { title, description, link } = req.body;

    project.title = title;
    project.description = description;
    project.link = link;

    // If new thumbnail uploaded
    if (req.file) {
      // Remove old image
      if (project.thumbnail) {
        const oldFilePath = path.join(uploadsPath, project.thumbnail);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      project.thumbnail = req.file.filename;
    }

    await project.save();

    return res.json({ success: true, project });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* DELETE — Remove a project */
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete thumbnail if exists
    if (project.thumbnail) {
      const filePath = path.join(uploadsPath, project.thumbnail);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Project.findByIdAndDelete(id);

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
