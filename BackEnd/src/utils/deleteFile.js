import fs from "fs";

export const deleteFileIfExists = (filePath) => {
  if (!filePath) return;

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("Failed to delete file:", filePath, error.message);
  }
};
