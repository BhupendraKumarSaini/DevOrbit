export const isEmpty = (value) => !value || value.trim().length === 0;

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidHexColor = (color) => /^#([0-9A-F]{3}){1,2}$/i.test(color);

export const isValidImage = (file, maxSizeMB = 2) => {
  if (!file) return false;

  const validTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/svg+xml",
  ];

  return validTypes.includes(file.type) && file.size <= maxSizeMB * 1024 * 1024;
};

export const isValidPDF = (file, maxSizeMB = 5) =>
  file &&
  file.type === "application/pdf" &&
  file.size <= maxSizeMB * 1024 * 1024;
