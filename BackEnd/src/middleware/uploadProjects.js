import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "src/uploads/projects",
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  },
});

export const uploadProjectImg = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/svg+xml",
    ];

    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Invalid image type"), false);
  },
});
