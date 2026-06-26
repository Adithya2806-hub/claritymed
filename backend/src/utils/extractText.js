const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");
const fs = require("fs");

const extractTextFromFile = async (filePath, mimetype) => {
  try {
    if (mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return { text: data.text, type: "pdf" };
    } else if (mimetype.startsWith("image/")) {
      const result = await Tesseract.recognize(filePath, "eng", {
        logger: () => {},
      });
      return { text: result.data.text, type: "image" };
    }
    return { text: "", type: "unknown" };
  } catch (err) {
    console.error("Text extraction error:", err.message);
    return { text: "", type: "error" };
  }
};

module.exports = { extractTextFromFile };
