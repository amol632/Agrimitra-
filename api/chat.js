export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { message, image } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    const body = image
      ? {
          contents: [
            {
              parts: [
                { text: message || "या फोटोबद्दल माहिती द्या" },
                {
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: image
                  }
                }
              ]
            }
          ]
        }
      : {
          contents: [{ parts: [{ text: message }] }]
        };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }
    );

    const data = await response.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "🤖 उत्तर मिळालं नाही.";

    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
