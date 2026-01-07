-- Create storage bucket for project assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-assets',
  'project-assets',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for project-assets bucket

-- Allow service role full access
CREATE POLICY "Service role full access project-assets"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'project-assets')
WITH CHECK (bucket_id = 'project-assets');

-- Allow authenticated users to read public assets
CREATE POLICY "Authenticated users can view project-assets"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'project-assets');

-- Allow admins to upload/delete
CREATE POLICY "Admins can upload project-assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-assets'
  AND EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
);

CREATE POLICY "Admins can delete project-assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'project-assets'
  AND EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'is_admin' = 'true')
);
