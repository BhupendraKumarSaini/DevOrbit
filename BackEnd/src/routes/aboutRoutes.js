import express from "express";
import { upload } from "../middleware/upload.js";
import { getAbout, updateAbout } from "../controllers/aboutController.js";

const router = express.Router();

router.get("/", getAbout);
router.put("/", upload.single("image"), updateAbout);

export default router;
