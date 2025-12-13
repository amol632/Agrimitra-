// 1. Google Gemini SDK इम्पोर्ट करा
import { GoogleGenerativeAI } from "@google/genai";

// 2. Vercel Environment Variable मधून API Key घ्या
// KEY चे नाव: GEMINI_API_KEY
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 

// 3. API Key उपलब्ध नसल्यास त्रुटी हाताळा
if (!GEMINI_API_KEY) {
    throw new Error("API Key not set.");
}

// 4. Google Generative AI क्लायंट सुरू करा
const ai = new GoogleGenerativeAI(GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method allowed" });
  }

  try {
    const { message } = req.body;
    
    // 5. System Instruction सेट करा
    const config = {
      systemInstruction: 
        "तुम्ही 'अग्रिमित्र' (Agrimitra) चे AI सल्लागार आहात. तुम्ही शेतकऱ्यांच्या प्रश्नांची उत्तरे देत आहात.",
      temperature: 0.2, 
    };

    // 6. Gemini API ला कॉल करा
    const response = await ai.generateContent({
        model: "gemini-1.5-flash", 
        contents: [{ parts: [{ text: message }] }],
        config: config, 
    });
      
    const reply = response.text || "🤖 क्षमस्व, उत्तर मिळू शकले नाही.";

    return res.status(200).json({ reply });
    
  } catch (err) {
    console.error("Gemini API Server Error:", err.message);
    return res.status(500).json({ error: "Server error during AI processing." });
  }
}

