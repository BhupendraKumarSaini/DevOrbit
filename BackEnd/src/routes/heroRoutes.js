import express from "express";
import multer from "multer";
import { getHero, updateHero } from "../controllers/heroController.js";

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
  destination: "src/uploads",
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Routes
router.get("/", getHero);
router.put("/", upload.single("image"), updateHero);

export default router;
