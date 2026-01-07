-- Migration: Add SEO fields to 'post' table
-- Author: Vivek's AI Pair Programmer
-- Date: 2025-12-15
-- Description: Adds meta_title, meta_description, and keywords to support SEO requirements for legacy migration.

ALTER TABLE public.post
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS keywords TEXT,
ADD COLUMN IF NOT EXISTS canonical_url TEXT;

-- Comment on columns for clarity
COMMENT ON COLUMN public.post.meta_title IS 'SEO Title Tag (60 chars max recommended)';
COMMENT ON COLUMN public.post.meta_description IS 'SEO Meta Description (160 chars max recommended)';
COMMENT ON COLUMN public.post.keywords IS 'Comma-separated keywords for legacy support (optional)';
COMMENT ON COLUMN public.post.canonical_url IS 'Canonical URL if different from current slug';
