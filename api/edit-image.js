/**
 * Vercel Serverless Function: /api/edit-image
 * Handles editing and restyling an existing design image via server-side AI processing.
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Only POST requests are supported." });
  }

  try {
    const { originalImageUrl, prompt, styleToken, modifications } = req.body || {};

    if (!prompt && !modifications) {
      return res.status(400).json({ error: "Missing required parameter: 'prompt' or 'modifications'" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    let refinedPrompt = `Restyle image: ${prompt || "re-imagine design"}. Modifications: ${modifications || "enhanced materials and lighting"}.`;

    if (apiKey && apiKey.trim() !== "") {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const aiRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Compose a prompt for modifying an architectural render: Base style "${styleToken || "modern"}", requested changes "${modifications || prompt}".`,
                  },
                ],
              },
            ],
          }),
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const text = aiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) refinedPrompt = text.trim();
        }
      } catch (err) {
        console.warn("[API/edit-image] Gemini prompt refinement error:", err.message);
      }
    }

    const newSeed = Math.floor(Math.random() * 900000) + 100000;
    const editedUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      refinedPrompt.slice(0, 900)
    )}?width=1024&height=768&nologo=true&seed=${newSeed}`;

    return res.status(200).json({
      success: true,
      originalImageUrl,
      editedImageUrl: editedUrl,
      promptUsed: refinedPrompt,
    });
  } catch (err) {
    console.error("[API/edit-image] Error:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
}
