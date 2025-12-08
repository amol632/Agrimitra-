export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
      reply:
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "माफ करा, रोग ओळखता आला नाही."
    });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
}
