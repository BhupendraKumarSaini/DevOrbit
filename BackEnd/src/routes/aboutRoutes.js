import express from "express";
import { upload } from "../middleware/upload.js";
import { getAbout, updateAbout } from "../controllers/aboutController.js";

const router = express.Router();

/* GET — Fetch About section */
router.get("/", getAbout);

/* PUT — Update About section */
router.put("/", upload.single("image"), updateAbout);

export default router;
