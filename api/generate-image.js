/**
 * Vercel Serverless Function: /api/generate-image
 * Generates photorealistic architectural interior, exterior, and compound design renders.
 * Uses Gemini API server-side (process.env.GEMINI_API_KEY) and uploads results to Supabase Storage ('design-images').
 * Includes per-session/IP rate limiting.
 */

import { checkRateLimit } from "./_rateLimiter.js";
import { uploadImageToSupabase } from "./_supabaseServer.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Only POST requests are supported." });
  }

  // 1. Rate Limiting Check
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

    let enhancedPrompt = basePrompt;
    let generatedImageRaw = null;

    // 2. Server-side Gemini integration if API key exists
    if (apiKey && apiKey.trim() !== "" && apiKey !== "your_gemini_api_key_here") {
      // First try prompt refinement with Gemini 2.0 Flash
      try {
        const geminiRefineUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const aiRes = await fetch(geminiRefineUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Refine this architectural ${type} design prompt into a detailed, photorealistic 8K architectural rendering prompt under 60 words: "${basePrompt}". Focus on Indian materials, textures, and lighting.`,
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
        console.warn("[API/generate-image] Gemini prompt refinement fallback:", err.message);
      }

      // Try Gemini Imagen 3 image generation endpoint
      try {
        const imagenUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
        const imagenRes = await fetch(imagenUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            instances: [{ prompt: enhancedPrompt }],
            parameters: {
              sampleCount: 1,
              aspectRatio: "4:3",
              outputOptions: { mimeType: "image/jpeg" },
            },
          }),
        });

        if (imagenRes.ok) {
          const imagenData = await imagenRes.json();
          const b64 = imagenData?.predictions?.[0]?.bytesBase64Encoded;
          if (b64) {
            generatedImageRaw = `data:image/jpeg;base64,${b64}`;
          }
        }
      } catch (err) {
        console.warn("[API/generate-image] Imagen 3 call fallback:", err.message);
      }
    }

    const baseSeed = seed || Math.floor(Math.random() * 800000) + 100000;
    const numVariations = Math.min(Math.max(1, parseInt(count) || 1), 4);
    const finalUrls = [];

    // 3. Generate image variations & Upload to Supabase Storage 'design-images'
    for (let i = 0; i < numVariations; i++) {
      let rawSource;
      if (i === 0 && generatedImageRaw) {
        rawSource = generatedImageRaw;
      } else {
        const currentSeed = baseSeed + i * 1337;
        rawSource = `https://image.pollinations.ai/prompt/${encodeURIComponent(
          `${enhancedPrompt}, architectural render variation ${i + 1}`.slice(0, 900)
        )}?width=1024&height=768&nologo=true&seed=${currentSeed}`;
      }

      // Upload generated image to Supabase Storage bucket 'design-images'
      const publicUrl = await uploadImageToSupabase(rawSource, `${type}_${style}`);
      finalUrls.push(publicUrl || rawSource);
    }

    return res.status(200).json({
      success: true,
      type,
      roomType,
      style,
      url: finalUrls[0],
      urls: finalUrls,
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
