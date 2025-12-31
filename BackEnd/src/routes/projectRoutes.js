import express from "express";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { uploadProjectImg } from "../middleware/uploadProjects.js";

const router = express.Router();

/* GET — Fetch all projects */
router.get("/", getProjects);

/* POST — Create a project */
router.post("/", uploadProjectImg.single("thumbnail"), createProject);

/* PUT — Update a project */
router.put("/:id", uploadProjectImg.single("thumbnail"), updateProject);

/* DELETE — Remove a project */
router.delete("/:id", deleteProject);

export default router;
