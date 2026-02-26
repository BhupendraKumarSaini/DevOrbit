import express from "express";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { uploadProjectImg } from "../middleware/uploadProjects.js";

const router = express.Router();

/* GET */
router.get("/", getProjects);

/* POST */
router.post("/", uploadProjectImg.single("thumbnail"), createProject);

/* PUT */
router.put("/:id", uploadProjectImg.single("thumbnail"), updateProject);

/* DELETE */
router.delete("/:id", deleteProject);

export default router;
