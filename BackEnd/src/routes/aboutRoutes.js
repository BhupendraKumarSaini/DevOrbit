import express from "express";
import { upload } from "../middleware/upload.js";
import { getAbout, updateAbout } from "../controllers/aboutController.js";

const router = express.Router();

/* GET */
router.get("/", getAbout);

/* PUT */
router.put("/", updateAbout);

export default router;
