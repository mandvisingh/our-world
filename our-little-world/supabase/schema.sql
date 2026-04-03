-- Books table for Her World bookshelf
-- Run this in your Supabase SQL Editor (supabase.com → project → SQL Editor)

create table if not exists books (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  author      text not null,
  shelf       text not null default 'to-read'
              check (shelf in ('currently-reading', 'read', 'to-read', 'paused', 'dnf')),
  date_read   text,                -- e.g. "Feb 27, 2026" or null
  user_id     text default 'her',  -- future: 'her' or 'him'
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Index for fast shelf queries
create index if not exists idx_books_shelf on books (shelf);
create index if not exists idx_books_user on books (user_id);

-- Auto-update updated_at on row change
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger books_updated_at
  before update on books
  for each row execute function update_updated_at();

-- Row Level Security (public read, authenticated write)
alter table books enable row level security;

-- Anyone can read books
create policy "Books are publicly readable"
  on books for select
  using (true);

-- Authenticated users can insert/update/delete
create policy "Authenticated users can insert books"
  on books for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update books"
  on books for update
  to authenticated
  using (true);

create policy "Authenticated users can delete books"
  on books for delete
  to authenticated
  using (true);

-- Recommendations table (her top picks)
create table if not exists recommendations (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  author      text not null,
  user_id     text default 'her',
  sort_order  int default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create trigger recommendations_updated_at
  before update on recommendations
  for each row execute function update_updated_at();

alter table recommendations enable row level security;

create policy "Recommendations are publicly readable"
  on recommendations for select using (true);

create policy "Authenticated users can manage recommendations"
  on recommendations for all
  to authenticated
  using (true);

-- For development: also allow anon key to write (remove in production)
create policy "Anon can insert books (dev)"
  on books for insert
  to anon
  with check (true);

create policy "Anon can update books (dev)"
  on books for update
  to anon
  using (true);

create policy "Anon can delete books (dev)"
  on books for delete
  to anon
  using (true);

create policy "Anon can insert recommendations (dev)"
  on recommendations for insert
  to anon with check (true);

create policy "Anon can update recommendations (dev)"
  on recommendations for update
  to anon using (true);

create policy "Anon can delete recommendations (dev)"
  on recommendations for delete
  to anon using (true);
