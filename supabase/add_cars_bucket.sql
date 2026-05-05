-- Create the cars storage bucket
insert into storage.buckets (id, name, public)
values ('cars', 'cars', true)
on conflict (id) do nothing;

-- Allow public access to view car images
create policy "Car images are publicly accessible"
on storage.objects for select
to public
using ( bucket_id = 'cars' );

-- Allow authenticated users to upload car images
create policy "Users can upload car images"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'cars' );

-- Allow owners to update their own car images
-- Note: This assumes folder naming convention is user_id/filename
create policy "Users can update their own car images"
on storage.objects for update
to authenticated
using ( bucket_id = 'cars' and (storage.foldername(name))[1] = auth.uid()::text );

-- Allow owners to delete their own car images
create policy "Users can delete their own car images"
on storage.objects for delete
to authenticated
using ( bucket_id = 'cars' and (storage.foldername(name))[1] = auth.uid()::text );
