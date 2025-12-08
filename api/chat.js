export const config = {
  api: { bodyParser: false }
};

import formidable from "formidable";
import fs from "fs";

export default async function handler(req, res) {
  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    const message = fields.message || "";
    const imageFile = files.image;

    let imageBase64 = null;

    if (imageFile) {
      const buffer = fs.readFileSync(imageFile.filepath);
      imageBase64 = buffer.toString("base64");
    }

    const parts = [];
    if (message) parts.push({ text: message });

    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: imageFile.mimetype,
          data: imageBase64
        }
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts }]
        })
      }
    );

    const data = await response.json();
    res.json({
      reply: data?.candidates?.[0]?.content?.parts?.[0]?.text || "उत्तर मिळाले नाही"
    });
  });
}
