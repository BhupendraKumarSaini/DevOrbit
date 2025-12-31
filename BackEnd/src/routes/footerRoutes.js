import express from "express";
import { uploadResume } from "../middleware/uploadResume.js";
import { getFooter, saveFooter } from "../controllers/footerController.js";

const router = express.Router();

/* GET — Fetch Footer data */
router.get("/", getFooter);

/* POST — Create Footer data */
router.post("/", uploadResume.single("resume"), saveFooter);

/* PUT — Update Footer data */
router.put("/", uploadResume.single("resume"), saveFooter);

export default router;
