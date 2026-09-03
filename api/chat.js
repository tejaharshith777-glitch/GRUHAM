/**
 * Vercel Serverless Function: /api/chat
 * Handles AI chatbot conversations using Google Gemini 2.0 Flash server-side.
 */

export default async function handler(req, res) {
  // Enforce POST method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Only POST requests are supported." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return res.status(500).json({
      error: "Server Configuration Error: GEMINI_API_KEY environment variable is not configured on Vercel.",
    });
  }

  try {
    const { prompt, schema, history } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: "Missing required parameter: 'prompt'" });
    }

    const systemInstruction = "You are GRUHAM AI, an expert Indian residential architectural assistant. Help users plan home layouts, Vastu compliance, construction cost estimates in INR, and material choices.";

    const contents = [
      ...(Array.isArray(history) ? history : []),
      { role: "user", parts: [{ text: `${systemInstruction}\nUser Question: ${prompt}` }] },
    ];

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: schema
          ? { responseMimeType: "application/json", responseSchema: schema }
          : undefined,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[API/chat] Gemini API HTTP error:", response.status, errorText);
      return res.status(response.status).json({
        error: `Gemini API returned status ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";

    let parsed = text;
    if (schema) {
      try {
        parsed = JSON.parse(text);
      } catch (err) {
        console.warn("[API/chat] Schema parse warning:", err);
      }
    }

    return res.status(200).json({
      success: true,
      text,
      result: parsed,
    });
  } catch (err) {
    console.error("[API/chat] Internal error:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message || "An unexpected error occurred",
    });
  }
}
