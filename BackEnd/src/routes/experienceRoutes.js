import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getExperiences,
  addExperience,
  updateExperience,
  deleteExperience,
} from "../controllers/experienceController.js";

const router = express.Router();

/* PUBLIC */
router.get("/", getExperiences);

/* ADMIN */
router.post("/", authMiddleware, addExperience);
router.put("/:id", authMiddleware, updateExperience);
router.delete("/:id", authMiddleware, deleteExperience);

export default router;
