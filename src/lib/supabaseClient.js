/**
 * GRUHAM Supabase Client & Persistence Engine
 * Connects to PostgreSQL Database and Supabase Storage.
 *
 * Configured via environment variables:
 * - VITE_SUPABASE_URL / SUPABASE_URL
 * - VITE_SUPABASE_ANON_KEY / SUPABASE_ANON_KEY
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env?.VITE_SUPABASE_URL ||
  import.meta.env?.SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "";

const supabaseAnonKey =
  import.meta.env?.VITE_SUPABASE_ANON_KEY ||
  import.meta.env?.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseUrl !== "https://your-project.supabase.co" &&
    supabaseAnonKey &&
    supabaseAnonKey !== "your-anon-key"
);

if (!isSupabaseConfigured) {
  console.warn(
    "[GRUHAM Supabase] Supabase credentials not fully configured in .env. Falling back to local persistence mode."
  );
}

// Initialize Supabase Client singleton
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Retrieves per-browser anonymous user ID from localStorage as a fallback identifier
 * when no authenticated session is present.
 * NOTE: Temporary fallback for unauthenticated guest design persistence.
 */
export function getBrowserAnonId() {
  if (typeof window === "undefined") return "guest-server";
  let anonId = localStorage.getItem("gruham_browser_anon_id");
  if (!anonId) {
    anonId = "anon_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
    localStorage.setItem("gruham_browser_anon_id", anonId);
  }
  return anonId;
}

/**
 * Uploads an image blob or URL to Supabase Storage bucket 'design-images'
 * and returns the public URL.
 */
export async function uploadDesignImage(imageData, fileName) {
  if (!isSupabaseConfigured || !supabase) {
    return typeof imageData === "string" ? imageData : null;
  }

  try {
    const bucketName = "design-images";
    const path = `designs/${Date.now()}_${fileName || "render.png"}`;

    let blob = imageData;
    if (typeof imageData === "string" && imageData.startsWith("data:")) {
      const res = await fetch(imageData);
      blob = await res.blob();
    } else if (typeof imageData === "string" && imageData.startsWith("http")) {
      // If already a remote URL, return it directly or attempt upload
      return imageData;
    }

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(path, blob, {
        contentType: "image/png",
        upsert: true,
      });

    if (error) {
      console.warn("[Supabase Storage] Upload error:", error.message);
      return typeof imageData === "string" ? imageData : null;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return publicUrlData?.publicUrl || imageData;
  } catch (err) {
    console.error("[Supabase Storage] Unexpected upload failure:", err);
    return typeof imageData === "string" ? imageData : null;
  }
}

export default supabase;
