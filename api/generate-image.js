/**
 * Vercel Serverless Function: /api/generate-image
 * Generates photorealistic architectural interior, exterior, and compound design renders.
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
    const {
      type = "interior",
      roomType = "Living Room",
      style = "traditional_indian",
      prompt = "",
      referenceImageBase64 = null,
      count = 1,
      seed,
    } = req.body || {};

    const apiKey = process.env.GEMINI_API_KEY;

    let basePrompt = prompt;
    if (!basePrompt) {
      if (type === "interior") {
        basePrompt = `${roomType} interior design in ${style} style, luxury Indian home aesthetic, warm ambient brass lighting, high quality photorealistic render`;
      } else if (type === "exterior") {
        basePrompt = `Front elevation facade design of an Indian villa home in ${style} style, stone cladding, teakwood entrance portico, 4K architectural render`;
      } else {
        basePrompt = `Boundary compound wall and gate landscaping design for an Indian house in ${style} style, warm pillar lanterns, flower beds, sliding gate`;
      }
    }

    // Enhance prompt via Gemini server-side if key is configured
    let enhancedPrompt = basePrompt;
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
                    text: `Refine this architectural ${type} design prompt into a photorealistic architectural rendering prompt under 50 words: "${basePrompt}".`,
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
        console.warn("[API/generate-image] Gemini prompt refinement error:", err.message);
      }
    }

    const baseSeed = seed || Math.floor(Math.random() * 800000) + 100000;
    const urls = [];

    const numVariations = Math.min(Math.max(1, parseInt(count) || 1), 4);
    for (let i = 0; i < numVariations; i++) {
      const currentSeed = baseSeed + i * 1337;
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        `${enhancedPrompt}, variation ${i + 1}`.slice(0, 900)
      )}?width=1024&height=768&nologo=true&seed=${currentSeed}`;
      urls.push(imageUrl);
    }

    return res.status(200).json({
      success: true,
      type,
      roomType,
      style,
      url: urls[0],
      urls,
      enhancedPrompt,
      remainingGenerations: rateLimit.remaining,
    });
  } catch (err) {
    console.error("[API/generate-image] Error:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
}
