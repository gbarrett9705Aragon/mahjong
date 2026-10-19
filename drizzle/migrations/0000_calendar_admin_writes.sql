DROP POLICY IF EXISTS "Anyone can delete calendar" ON public.calendar;
DROP POLICY IF EXISTS "Anyone can insert calendar" ON public.calendar;
DROP POLICY IF EXISTS "Anyone can update calendar" ON public.calendar;
CREATE POLICY "Admins can insert calendar" ON public.calendar FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update calendar" ON public.calendar FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete calendar" ON public.calendar FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));