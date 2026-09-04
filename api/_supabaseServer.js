import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  "";

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  "";

export const isSupabaseServerConfigured = Boolean(
  supabaseUrl &&
    supabaseUrl !== "https://your-project.supabase.co" &&
    supabaseKey &&
    supabaseKey !== "your-anon-key"
);

export const supabaseServer = isSupabaseServerConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * Uploads base64, buffer, or image URL to Supabase storage bucket 'design-images'
 * @param {string|Buffer} imageData - Base64 string, URL, or image buffer
 * @param {string} prefix - Filename prefix (e.g. "interior", "exterior", "edit")
 * @returns {Promise<string>} Public URL of the uploaded image
 */
export async function uploadImageToSupabase(imageData, prefix = "render") {
  if (!imageData) return null;
  if (!isSupabaseServerConfigured || !supabaseServer) {
    console.log("[Supabase Server] Supabase not fully configured on server, returning original image source.");
    return typeof imageData === "string" ? imageData : null;
  }

  try {
    const bucketName = "design-images";
    const fileName = `designs/${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.png`;

    let buffer;
    let contentType = "image/png";

    if (typeof imageData === "string" && imageData.startsWith("data:")) {
      const parts = imageData.split(",");
      const mimeMatch = parts[0].match(/:(.*?);/);
      if (mimeMatch) contentType = mimeMatch[1];
      buffer = Buffer.from(parts[1], "base64");
    } else if (typeof imageData === "string" && imageData.startsWith("http")) {
      // Remote URL - fetch image binary
      const res = await fetch(imageData);
      if (!res.ok) return imageData;
      const arrayBuffer = await res.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      const cType = res.headers.get("content-type");
      if (cType) contentType = cType;
    } else if (typeof imageData === "string") {
      // Raw base64 string
      buffer = Buffer.from(imageData, "base64");
    } else if (Buffer.isBuffer(imageData)) {
      buffer = imageData;
    } else {
      return imageData;
    }

    const { data, error } = await supabaseServer.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.warn("[Supabase Server Storage] Upload error:", error.message);
      return typeof imageData === "string" ? imageData : null;
    }

    const { data: publicUrlData } = supabaseServer.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return publicUrlData?.publicUrl || (typeof imageData === "string" ? imageData : null);
  } catch (err) {
    console.error("[Supabase Server Storage] Exception during upload:", err);
    return typeof imageData === "string" ? imageData : null;
  }
}
