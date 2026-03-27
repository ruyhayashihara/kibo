-- Migration: Adicionar campos de perfil do candidato
-- Execute este script no SQL Editor do Supabase Dashboard

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS birth_date DATE,
  ADD COLUMN IF NOT EXISTS whatsapp TEXT,
  ADD COLUMN IF NOT EXISTS best_call_time TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS province TEXT,
  ADD COLUMN IF NOT EXISTS gender TEXT,
  ADD COLUMN IF NOT EXISTS can_relocate TEXT,
  ADD COLUMN IF NOT EXISTS jlpt_level TEXT,
  ADD COLUMN IF NOT EXISTS nationality TEXT,
  ADD COLUMN IF NOT EXISTS visa_type TEXT,
  ADD COLUMN IF NOT EXISTS visa_other TEXT;
