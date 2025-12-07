export default async function handler(req, res) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const body = req.body;
    let requestBody;

    if (body.image) {
      requestBody = {
        contents: [
          {
            parts: [
              { text: "या फोटोवर आधारित माहिती द्या (शेतीसाठी संबंधित)." },
              {
                inlineData: {
                  mimeType: body.mimeType,
                  data: body.image,
                },
              },
            ],
          },
        ],
      };
    } else {
      requestBody = {
        contents: [{ parts: [{ text: body.prompt || "Hello" }] }],
      };
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "उत्तर मिळालं नाही.";
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ reply: "Server error ❌" });
  }
}
