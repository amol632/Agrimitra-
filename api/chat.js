export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { message, image, mimeType } = req.body;

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY missing" });
    }

    const parts = [];

    // Text
    parts.push({
      text: message || "या फोटोबद्दल शेतीसंबंधी माहिती द्या"
    });

    // Image (optional)
    if (image && mimeType) {
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: image
        }
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts }],
          systemInstruction: {
            parts: [
              {
                text: "तुम्ही AgriMitra चे AI सल्लागार आहात. शेतकऱ्यांना पीक, रोग, खत, हवामान यावर सोप्या मराठीत उत्तर द्या."
              }
            ]
          }
        })
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "🤖 उत्तर मिळाले नाही";

    return res.status(200).json({ reply });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "AI Server Error" });
  }
}
