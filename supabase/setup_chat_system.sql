-- Create chats table to link bookings with a conversation
create table if not exists chats (
  id uuid default gen_random_uuid() primary key,
  booking_id uuid references bookings(id) on delete cascade not null,
  owner_id uuid references auth.users(id) not null,
  renter_id uuid references auth.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(booking_id)
);

-- Create messages table
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  chat_id uuid references chats(id) on delete cascade not null,
  sender_id uuid references auth.users(id) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table chats enable row level security;
alter table messages enable row level security;

-- Policies for chats
drop policy if exists "Users can view their own chats" on chats;
create policy "Users can view their own chats"
on chats for select
to authenticated
using ( auth.uid() = owner_id or auth.uid() = renter_id );

-- Policies for messages
drop policy if exists "Users can view messages in their chats" on messages;
create policy "Users can view messages in their chats"
on messages for select
to authenticated
using ( 
  exists (
    select 1 from chats 
    where chats.id = messages.chat_id 
    and (chats.owner_id = auth.uid() or chats.renter_id = auth.uid())
  )
);

drop policy if exists "Users can send messages in their chats" on messages;
create policy "Users can send messages in their chats"
on messages for insert
to authenticated
with check (
  exists (
    select 1 from chats 
    where chats.id = messages.chat_id 
    and (chats.owner_id = auth.uid() or chats.renter_id = auth.uid())
  )
  and sender_id = auth.uid()
);

-- Function to automatically create a chat when a booking is confirmed
create or replace function handle_booking_confirmation()
returns trigger as $$
begin
  if new.status = 'confirmed' and old.status = 'pending' then
    insert into chats (booking_id, owner_id, renter_id)
    values (new.id, new.owner_id, new.renter_id)
    on conflict (booking_id) do nothing;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function
drop trigger if exists on_booking_confirmed on bookings;
create trigger on_booking_confirmed
after update on bookings
for each row
execute function handle_booking_confirmation();
