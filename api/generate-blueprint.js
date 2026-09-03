/**
 * Vercel Serverless Function: /api/generate-blueprint
 * Fast, rule-based architectural floor plan generator (Vastu compliant).
 * Completely deterministic geometry layout + optional server-side AI design rationale.
 */

import { generateBlueprint } from "../src/lib/blueprintEngine.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Only POST requests are supported." });
  }

  try {
    const {
      plotLength = 40,
      plotWidth = 30,
      bhk = 2,
      floors = 2,
      facing = "E",
      vastuPreference = "strict",
      style = "traditional",
      budget = "standard",
      city = "Bengaluru",
      includeAiRationale = true,
    } = req.body || {};

    // 1. Generate rule-based deterministic layout & BOQ
    const blueprintData = generateBlueprint({
      plotLength,
      plotWidth,
      bhk,
      floors,
      facing,
      vastuPreference,
      style,
      budget,
      city,
    });

    // 2. Optional AI-assisted written design rationale via Gemini (server-side only)
    const apiKey = process.env.GEMINI_API_KEY;
    if (includeAiRationale && apiKey && apiKey.trim() !== "") {
      try {
        const prompt = `Provide a concise 3-sentence architectural design rationale for a ${blueprintData.bhk} BHK, ${blueprintData.floors}-floor ${blueprintData.facing}-facing Indian home (${blueprintData.plotWidth}x${blueprintData.plotLength} ft). Highlight Vastu SE Kitchen and SW Master Bedroom benefits.`;
        
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const aiRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
          }),
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const text = aiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            blueprintData.designRationale = text.trim();
          }
        }
      } catch (err) {
        console.warn("[API/generate-blueprint] Gemini rationale fallback:", err.message);
      }
    }

    return res.status(200).json({
      success: true,
      blueprint: blueprintData,
    });
  } catch (err) {
    console.error("[API/generate-blueprint] Error:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
}
