import multer from "multer";
import path from "path";
import fs from "fs";

const skillsPath = path.resolve("src/uploads/skills");

if (!fs.existsSync(skillsPath)) {
  fs.mkdirSync(skillsPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: skillsPath,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const uploadSkillIcon = multer({ storage });
