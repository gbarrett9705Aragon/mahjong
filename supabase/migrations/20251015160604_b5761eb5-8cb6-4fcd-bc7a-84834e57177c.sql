-- Drop existing tables and their dependencies
DROP TABLE IF EXISTS public.tee_time_signups CASCADE;
DROP TABLE IF EXISTS public.tee_times CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop the trigger and function for profiles if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create tee_times table
CREATE TABLE public.tee_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course TEXT NOT NULL DEFAULT 'SCP',
  date DATE NOT NULL,
  time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create players table
CREATE TABLE public.players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  last_name TEXT NOT NULL,
  first_name TEXT NOT NULL,
  email TEXT,
  telephone TEXT,
  handicap NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create announcements table
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notes TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create calendar table
CREATE TABLE public.calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attachment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.tee_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no login required)
CREATE POLICY "Anyone can view tee times" ON public.tee_times FOR SELECT USING (true);
CREATE POLICY "Anyone can insert tee times" ON public.tee_times FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update tee times" ON public.tee_times FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete tee times" ON public.tee_times FOR DELETE USING (true);

CREATE POLICY "Anyone can view players" ON public.players FOR SELECT USING (true);
CREATE POLICY "Anyone can insert players" ON public.players FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update players" ON public.players FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete players" ON public.players FOR DELETE USING (true);

CREATE POLICY "Anyone can view announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Anyone can insert announcements" ON public.announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update announcements" ON public.announcements FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete announcements" ON public.announcements FOR DELETE USING (true);

CREATE POLICY "Anyone can view calendar" ON public.calendar FOR SELECT USING (true);
CREATE POLICY "Anyone can insert calendar" ON public.calendar FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update calendar" ON public.calendar FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete calendar" ON public.calendar FOR DELETE USING (true);