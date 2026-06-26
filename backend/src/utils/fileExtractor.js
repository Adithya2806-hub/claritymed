const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");

const extractTextFromFile = async (filePath, mimeType) => {
  try {
    if (mimeType === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text || "";
    } else {
      const result = await Tesseract.recognize(filePath, "eng", {
        logger: () => {},
      });
      return result.data.text || "";
    }
  } catch (err) {
    console.error("Text extraction error:", err.message);
    return "";
  }
};

const fileToBase64 = (filePath) => {
  const data = fs.readFileSync(filePath);
  return data.toString("base64");
};

const getMimeType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".pdf": "application/pdf",
  };
  return map[ext] || "application/octet-stream";
};

module.exports = { extractTextFromFile, fileToBase64, getMimeType };
