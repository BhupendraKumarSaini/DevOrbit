import Project from "../models/Project.js";
import fs from "fs";
import path from "path";

const uploadsPath = path.resolve("src/uploads/projects");

/* GET */
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    return res.json(projects);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

/* POST */
export const createProject = async (req, res) => {
  try {
    const { title, summary, liveLink, githubLink } = req.body;

    const points = JSON.parse(req.body.points || "[]");
    const techStack = JSON.parse(req.body.techStack || "[]");

    const project = await Project.create({
      title,
      summary,
      points,
      techStack,
      liveLink,
      githubLink,
      thumbnail: req.file ? req.file.filename : null,
    });

    res.json({ success: true, project });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* PUT */
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Not found" });

    project.title = req.body.title;
    project.summary = req.body.summary;
    project.liveLink = req.body.liveLink;
    project.githubLink = req.body.githubLink;

    project.points = JSON.parse(req.body.points || "[]");
    project.techStack = JSON.parse(req.body.techStack || "[]");

    if (req.file) {
      project.thumbnail = req.file.filename;
    }

    await project.save();
    res.json({ success: true, project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/* DELETE */
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
