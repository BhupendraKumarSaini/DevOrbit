import express from "express";
import {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController.js";
import { uploadSkillIcon } from "../middleware/uploadSkills.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getSkills);
router.post("/", auth, uploadSkillIcon.single("icon"), addSkill);
router.put("/:id", auth, uploadSkillIcon.single("icon"), updateSkill);
router.delete("/:id", auth, deleteSkill);

export default router;
