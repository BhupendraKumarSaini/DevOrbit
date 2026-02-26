import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  getCertifications,
  addCertification,
  updateCertification,
  deleteCertification,
} from "../controllers/certificationController.js";

const router = express.Router();

router.get("/", getCertifications);
router.post("/", auth, addCertification);
router.put("/:id", auth, updateCertification);
router.delete("/:id", auth, deleteCertification);

export default router;
