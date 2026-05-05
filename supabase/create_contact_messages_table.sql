-- Create contact_messages table
create table if not exists contact_messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  is_read boolean default false
);

-- Allow anonymous users to insert messages (since anyone can use the contact form)
drop policy if exists "Anyone can insert contact messages" on contact_messages;
create policy "Anyone can insert contact messages"
on contact_messages for insert
to public
with check (true);

-- Only authenticated admins should be able to view/update/delete (optional, but good practice)
-- Note: Assuming there's a way to identify admins, e.g., via a column in profiles or user_metadata
drop policy if exists "Admins can view contact messages" on contact_messages;
create policy "Admins can view contact messages"
on contact_messages for select
to authenticated
using ( (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true );

drop policy if exists "Admins can update contact messages" on contact_messages;
create policy "Admins can update contact messages"
on contact_messages for update
to authenticated
using ( (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true );
