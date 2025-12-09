import { GoogleGenerativeAI } from "@google/genai";

// Vercel/Next.js मध्ये ही API Key आपोआप ॲक्सेस होईल.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// API Key उपलब्ध नसल्यास त्वरित त्रुटी हाताळा
if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable not set.");
}

// Google Generative AI क्लायंट सुरू करा
const ai = new GoogleGenerativeAI(GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { message, image, mimeType } = req.body; // mimeType देखील स्वीकारा!
    
    let parts = [];

    // मजकूर (Text) भाग जोडा
    parts.push({ text: message || "माहिती द्या" });

    // इमेज भाग जोडा (Image)
    if (image && mimeType) {
      parts.push({
        inlineData: {
          mimeType: mimeType, // डायनॅमिक mimeType वापरा
          data: image
        }
      });
    }

    // gemini-1.5-flash मॉडेल वापरा
    const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ parts: parts }]
    });

    // SDK वापरल्याने प्रतिसाद हाताळणे सोपे होते.
    const reply = response.text || "🤖 उत्तर मिळालं नाही.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Gemini API Error:", err);
    // त्रुटीच्या तपशीलांसह प्रतिसाद द्या
    return res.status(500).json({ error: "Server error during Gemini call", details: err.message });
  }
}
