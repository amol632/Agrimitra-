export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { message, image } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    let parts = [];

    if (message) {
      parts.push({ text: message });
    }

    if (image) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: image
        }
      });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey
        },
        body: JSON.stringify({
          contents: [{ parts }]
        })
      }
    );

    const data = await response.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "उत्तर मिळालं नाही.";

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
