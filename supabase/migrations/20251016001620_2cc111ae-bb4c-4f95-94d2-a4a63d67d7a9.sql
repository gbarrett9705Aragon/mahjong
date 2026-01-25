-- Create storage bucket for calendar PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('calendar-files', 'calendar-files', true);

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload calendar files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'calendar-files');

-- Allow everyone to view calendar files
CREATE POLICY "Anyone can view calendar files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'calendar-files');

-- Allow authenticated users to delete calendar files
CREATE POLICY "Authenticated users can delete calendar files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'calendar-files');