/**
 * Vercel Serverless Function: /api/generate-image
 * Proxies interior/exterior/compound architectural image render generation.
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Only POST requests are supported." });
  }

  try {
    const { prompt, styleToken, count = 1, seed } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: "Missing required parameter: 'prompt'" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    // Enhance prompt via Gemini server-side if key is configured
    let enhancedPrompt = prompt;
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
                    text: `Refine this architectural interior/exterior design prompt into a photorealistic architectural rendering prompt: "${prompt}". Keep under 60 words.`,
                  },
                ],
              },
            ],
          }),
        });
        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const text = aiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) enhancedPrompt = text.trim();
        }
      } catch (err) {
        console.warn("[API/generate-image] Gemini enhancement fallback:", err.message);
      }
    }

    const baseSeed = seed || Math.floor(Math.random() * 800000) + 100000;
    const urls = [];

    for (let i = 0; i < Math.min(count, 4); i++) {
      const currentSeed = baseSeed + i * 1337;
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        `${enhancedPrompt}, variation ${i + 1}`.slice(0, 900)
      )}?width=1024&height=768&nologo=true&seed=${currentSeed}`;
      urls.push(imageUrl);
    }

    return res.status(200).json({
      success: true,
      url: urls[0],
      urls,
      enhancedPrompt,
    });
  } catch (err) {
    console.error("[API/generate-image] Error:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
}
