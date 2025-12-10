import express from "express";
import { uploadResume } from "../middleware/uploadResume.js";
import { getFooter, saveFooter } from "../controllers/footerController.js";

const router = express.Router();

router.get("/", getFooter);
router.post("/", uploadResume.single("resume"), saveFooter);
router.put("/", uploadResume.single("resume"), saveFooter);

export default router;
