import express from "express";
import multer from "multer";
import { getHero, updateHero } from "../controllers/heroController.js";

const router = express.Router();

/* Multer configuration for Hero image upload */
const storage = multer.diskStorage({
  destination: "src/uploads",
  filename: (req, file, cb) => {
    const uniqueFilename = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage });

/* GET — Fetch Hero section */
router.get("/", getHero);

/* PUT — Update Hero section */
router.put("/", upload.single("image"), updateHero);

export default router;
