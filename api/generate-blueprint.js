/**
 * Vercel Serverless Function: /api/generate-blueprint
 * Generates Vastu-compliant architectural floor plan specifications & BOQ estimates via Gemini AI server-side.
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Only POST requests are supported." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return res.status(500).json({
      error: "Server Configuration Error: GEMINI_API_KEY environment variable is missing on server.",
    });
  }

  try {
    const { plotLength, plotWidth, facing, floors, bhk, finish, city, requirements } = req.body || {};

    const prompt = `Act as an expert Indian architectural planner. Generate a detailed floor plan specification and itemized BOQ summary for:
- Plot Dimensions: ${plotLength || 40} ft x ${plotWidth || 60} ft
- Facing: ${facing || "East"} facing
- Floors: ${floors || "G+1"}
- BHK Configuration: ${bhk || 3} BHK
- Finish Quality Tier: ${finish || "Standard"}
- Location: ${city || "Bengaluru"}
- Custom User Notes: ${requirements || "N/A"}

Return a structured JSON object with keys:
"title", "totalAreaSqft", "vastuSummary", "roomLayouts" (array of objects with room, zone, sqft, notes), "estimatedCostRangeInr", "materialRecommendations".`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[API/generate-blueprint] Gemini API error:", response.status, errorText);
      return res.status(response.status).json({
        error: `Gemini API returned status ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    let blueprintData;
    try {
      blueprintData = JSON.parse(text);
    } catch (e) {
      blueprintData = { textRaw: text };
    }

    return res.status(200).json({
      success: true,
      blueprint: blueprintData,
    });
  } catch (err) {
    console.error("[API/generate-blueprint] Internal error:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
}
