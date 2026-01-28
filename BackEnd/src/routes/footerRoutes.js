import express from "express";
import { uploadResume } from "../middleware/uploadResume.js";
import { getFooter, saveFooter } from "../controllers/footerController.js";

const router = express.Router();

/* GET */
router.get("/", getFooter);

/* POST */
router.post("/", uploadResume.single("resume"), saveFooter);

/* PUT */
router.put("/", uploadResume.single("resume"), saveFooter);

export default router;
