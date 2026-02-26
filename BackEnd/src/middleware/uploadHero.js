import multer from "multer";
import path from "path";
import fs from "fs";

const heroPath = path.resolve("src/uploads/hero");

if (!fs.existsSync(heroPath)) {
  fs.mkdirSync(heroPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: heroPath,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const allowedTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
];

export const uploadHero = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid image type"));
    }
  },
});
