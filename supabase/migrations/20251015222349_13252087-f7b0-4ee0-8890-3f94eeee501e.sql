-- Create junction table for tee time signups
CREATE TABLE public.tee_time_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tee_time_id UUID NOT NULL REFERENCES public.tee_times(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(tee_time_id, player_id)
);

-- Enable Row Level Security
ALTER TABLE public.tee_time_signups ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (consistent with other tables)
CREATE POLICY "Anyone can view signups" 
ON public.tee_time_signups 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert signups" 
ON public.tee_time_signups 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can delete signups" 
ON public.tee_time_signups 
FOR DELETE 
USING (true);