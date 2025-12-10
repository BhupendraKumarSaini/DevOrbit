import express from "express";
import { upload } from "../middleware/upload.js";
import {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController.js";

const router = express.Router();

// GET all
router.get("/", getSkills);

// CREATE
router.post("/", upload.single("icon"), addSkill);

// UPDATE
router.put("/:id", upload.single("icon"), updateSkill);

// DELETE
router.delete("/:id", deleteSkill);

export default router;
