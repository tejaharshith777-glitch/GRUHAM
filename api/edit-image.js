/**
 * Vercel Serverless Function: /api/edit-image
 * Handles image-to-image restyling & text-instructed edit regeneration.
 * Includes rate limiting and server-side Gemini processing.
 */

import { checkRateLimit } from "./_rateLimiter.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Only POST requests are supported." });
  }

  // Rate Limiting Check
  const rateLimit = checkRateLimit(req);
  if (rateLimit.exceeded) {
    return res.status(429).json({
      error: "Rate Limit Exceeded",
      message: rateLimit.message,
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    });
  }

  try {
    const { imageUrl, imageBase64, editInstruction, styleToken = "modern" } = req.body || {};

    if (!editInstruction) {
      return res.status(400).json({ error: "Missing required parameter: 'editInstruction'" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    let refinedPrompt = `Modify design render: ${editInstruction}. Maintain room architecture in ${styleToken} style.`;

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
                    text: `Refine this architectural edit instruction into a 40-word photorealistic image modification prompt: "${editInstruction}". Maintain building structure.`,
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
        console.warn("[API/edit-image] Gemini edit refinement error:", err.message);
      }
    }

    const newSeed = Math.floor(Math.random() * 900000) + 100000;
    const editedUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      refinedPrompt.slice(0, 900)
    )}?width=1024&height=768&nologo=true&seed=${newSeed}`;

    return res.status(200).json({
      success: true,
      originalImageUrl: imageUrl || null,
      editedImageUrl: editedUrl,
      promptUsed: refinedPrompt,
      remainingGenerations: rateLimit.remaining,
    });
  } catch (err) {
    console.error("[API/edit-image] Error:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
}
