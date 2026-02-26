import express from "express";
import { uploadHero } from "../middleware/uploadHero.js";
import { getHero, updateHero } from "../controllers/heroController.js";

const router = express.Router();

router.get("/", getHero);
router.put("/", uploadHero.single("profileImage"), updateHero);

export default router;
