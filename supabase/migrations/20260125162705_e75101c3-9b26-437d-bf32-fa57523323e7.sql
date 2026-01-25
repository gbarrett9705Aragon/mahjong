-- Create enum for member types
CREATE TYPE public.member_type AS ENUM ('regular', 'sub');

-- Add member_type column to players table with default 'regular'
ALTER TABLE public.players 
ADD COLUMN member_type member_type NOT NULL DEFAULT 'regular';

-- Add subbing_for_player_id column to tee_time_signups table
-- This is nullable and only used when a 'sub' member signs up
ALTER TABLE public.tee_time_signups 
ADD COLUMN subbing_for_player_id UUID REFERENCES public.players(id) ON DELETE SET NULL;