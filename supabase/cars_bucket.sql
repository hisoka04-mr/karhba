-- Run this in your Supabase SQL Editor to create the 'cars' storage bucket

insert into storage.buckets (id, name, public) 
values ('cars', 'cars', true)
on conflict (id) do nothing;

-- Set up storage policies for the 'cars' bucket

-- 1. Allow public access to view images
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'cars' );

-- 2. Allow authenticated users to insert (upload) images
create policy "Allow authenticated uploads"
  on storage.objects for insert
  with check ( bucket_id = 'cars' and auth.role() = 'authenticated' );

-- 3. Allow users to update/delete their own images
create policy "Allow individual update/delete"
  on storage.objects for update
  using ( bucket_id = 'cars' and auth.uid() = owner );

create policy "Allow individual delete"
  on storage.objects for delete
  using ( bucket_id = 'cars' and auth.uid() = owner );
