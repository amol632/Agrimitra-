export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { message, image } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  try {
    const contents = [];

    // text message
    if (message) {
      contents.push({
        parts: [{ text: message }]
      });
    }

    // image message
    if (image) {
      contents.push({
        parts: [
          { text: "या फोटोवरून पिकाचा रोग ओळखा आणि उपाय सांगा." },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: image
            }
          }
        ]
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents })
      }
    );

    const data = await response.json();
    res.status(200).json({ reply: data?.candidates?.[0]?.content?.parts?.[0]?.text });
  } catch (e) {
    res.status(500).json({ error: "AI error" });
  }
}
