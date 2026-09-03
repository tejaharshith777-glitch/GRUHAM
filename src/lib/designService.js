/**
 * GRUHAM Unified Design Persistence Service
 * Real Save, Fetch, Image Upload & Delete for Supabase PostgreSQL + Storage
 * (Falls back gracefully to localStorage when Supabase is not configured)
 */

import { supabase, isSupabaseConfigured, getBrowserAnonId, uploadDesignImage } from "./supabaseClient";

/**
 * Saves a new blueprint, interior, exterior, or compound wall design.
 */
export async function saveDesign(designInput) {
  const currentUserId = designInput.user_id || getBrowserAnonId();
  
  // Upload image to Supabase Storage bucket 'design-images' if provided
  let storedImageUrl = designInput.image_url || designInput.visualization_url || designInput.image || null;
  if (storedImageUrl && !storedImageUrl.includes("supabase.co/storage")) {
    try {
      const publicUrl = await uploadDesignImage(
        storedImageUrl,
        `${designInput.design_type || "design"}_${Date.now()}.png`
      );
      if (publicUrl) storedImageUrl = publicUrl;
    } catch (err) {
      console.warn("[DesignService] Image upload fallback to URL string:", err);
    }
  }

  const record = {
    id: designInput.id || ("dsg_" + Date.now()),
    user_id: currentUserId,
    title: designInput.title || "Untitled Design Concept",
    design_type: designInput.design_type || "blueprint",
    style: designInput.style || "standard",
    vastu_preference: designInput.vastu_preference || "Vastu Compliant",
    plot_details: designInput.plot_details || designInput.inputs || {},
    blueprint_json: designInput.blueprint_json || designInput.plan || {},
    boq: designInput.boq || {},
    cost_breakdown: designInput.cost_breakdown || designInput.breakdown || [],
    image_urls: storedImageUrl ? [storedImageUrl] : (designInput.image_urls || []),
    visualization_url: storedImageUrl,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // 1. Try Supabase Postgres insert
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from("designs").insert([
        {
          user_id: record.user_id,
          title: record.title,
          design_type: record.design_type,
          style: record.style,
          vastu_preference: record.vastu_preference,
          plot_details: record.plot_details,
          blueprint_json: record.blueprint_json,
          boq: record.boq,
          cost_breakdown: record.cost_breakdown,
          image_urls: record.image_urls,
        },
      ]).select();

      if (!error && data && data[0]) {
        const saved = { ...record, id: data[0].id };
        saveToLocalStorage(saved);
        return saved;
      } else {
        console.warn("[Supabase] Insert warning:", error?.message);
      }
    } catch (err) {
      console.warn("[Supabase] Exception on insert, using local storage:", err);
    }
  }

  // 2. Fallback to LocalStorage persistence
  saveToLocalStorage(record);
  return record;
}

/**
 * Fetches saved designs for the user from Supabase (or LocalStorage fallback).
 */
export async function listSavedDesigns(userId) {
  const currentUserId = userId || getBrowserAnonId();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("designs")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        // Map database columns to component properties
        return data.map((d) => ({
          ...d,
          visualization_url: d.image_urls?.[0] || d.visualization_url || null,
          blueprint_url: d.image_urls?.[0] || null,
        }));
      }
    } catch (err) {
      console.warn("[Supabase] Error listing designs, reading local storage:", err);
    }
  }

  // LocalStorage Fallback
  return getLocalStorageDesigns();
}

/**
 * Deletes a saved design by ID from Supabase (and LocalStorage).
 */
export async function deleteSavedDesign(designId) {
  if (isSupabaseConfigured && supabase && designId && !designId.startsWith("dsg_")) {
    try {
      await supabase.from("designs").delete().eq("id", designId);
    } catch (err) {
      console.warn("[Supabase] Error deleting design:", err);
    }
  }

  // Remove from LocalStorage
  const local = getLocalStorageDesigns();
  const filtered = local.filter((d) => d.id !== designId);
  localStorage.setItem("gruham_saved_designs", JSON.stringify(filtered));
  return true;
}

// ─── Helpers for LocalStorage Fallback Persistence ────────────────────────────
function saveToLocalStorage(record) {
  try {
    const existing = getLocalStorageDesigns();
    const updated = [record, ...existing.filter((d) => d.id !== record.id)];
    localStorage.setItem("gruham_saved_designs", JSON.stringify(updated));
  } catch (e) {
    console.error("LocalStorage save error:", e);
  }
}

function getLocalStorageDesigns() {
  try {
    return JSON.parse(localStorage.getItem("gruham_saved_designs") || "[]");
  } catch (e) {
    return [];
  }
}
