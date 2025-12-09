export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "माफ करा, उत्तर मिळाले नाही. कृपया पुन्हा प्रयत्न करा.";

    res.status(200).json({ reply });

  } catch (err) {
    res.status(500).json({
      reply: "सर्व्हर मध्ये समस्या आली आहे."
    });
  }
}
