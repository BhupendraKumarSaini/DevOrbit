import express from "express";
import { upload } from "../middleware/upload.js";
import {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController.js";

const router = express.Router();

/* GET — Fetch all skills */
router.get("/", getSkills);

/* POST — Add a new skill */
router.post("/", upload.single("icon"), addSkill);

/* PUT — Update a skill */
router.put("/:id", upload.single("icon"), updateSkill);

/* DELETE — Remove a skill */
router.delete("/:id", deleteSkill);

export default router;
