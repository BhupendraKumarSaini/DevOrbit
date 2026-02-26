import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  getEducation,
  addEducation,
  updateEducation,
  deleteEducation,
} from "../controllers/educationController.js";

const router = express.Router();

router.get("/", getEducation);
router.post("/", auth, addEducation);
router.put("/:id", auth, updateEducation);
router.delete("/:id", auth, deleteEducation);

export default router;
