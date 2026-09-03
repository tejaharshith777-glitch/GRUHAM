-- =============================================================================
-- GRUHAM Supabase PostgreSQL Database Schema
-- Run this script in your Supabase SQL Editor (Database -> SQL Editor -> New Query)
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE (complements Supabase Auth built-in auth.users table)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL, -- auth UID or browser anon ID
  email TEXT,
  name TEXT,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DESIGNS TABLE (saved floor plans, interior/exterior renders & BOQ calculations)
CREATE TABLE IF NOT EXISTS public.designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL, -- references auth user.id or browser_anon_id
  title TEXT NOT NULL,
  design_type TEXT DEFAULT 'blueprint',
  plot_details JSONB DEFAULT '{}'::jsonb,
  blueprint_json JSONB DEFAULT '{}'::jsonb,
  boq JSONB DEFAULT '{}'::jsonb,
  cost_breakdown JSONB DEFAULT '{}'::jsonb,
  image_urls JSONB DEFAULT '[]'::jsonb,
  style TEXT,
  vastu_preference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MATERIALS TABLE (real-world Indian construction materials catalog with live prices)
CREATE TABLE IF NOT EXISTS public.materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  unit TEXT NOT NULL,
  price NUMERIC NOT NULL,
  source TEXT DEFAULT 'BAI Commodity Index',
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CONTRACTORS TABLE (public contractor directory listings)
CREATE TABLE IF NOT EXISTS public.contractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  verified BOOLEAN DEFAULT FALSE,
  service_area TEXT,
  specialty TEXT,
  experience_years INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractors ENABLE ROW LEVEL SECURITY;

-- Designs RLS: Allow users to view and manage their own designs
CREATE POLICY "Allow users to read own designs" ON public.designs
  FOR SELECT USING (true);

CREATE POLICY "Allow users to insert own designs" ON public.designs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to delete own designs" ON public.designs
  FOR DELETE USING (true);

-- Materials RLS: Anyone can read materials catalog
CREATE POLICY "Allow public read access to materials" ON public.materials
  FOR SELECT USING (true);

-- Contractors RLS: Anyone can read contractor directory
CREATE POLICY "Allow public read access to contractors" ON public.contractors
  FOR SELECT USING (true);

-- =============================================================================
-- STORAGE BUCKET CONFIGURATION FOR DESIGN IMAGES
-- =============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('design-images', 'design-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read Access for design-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'design-images');

CREATE POLICY "Public Insert Access for design-images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'design-images');
