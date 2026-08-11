-- Aditya Tomar Portfolio — Supabase schema + RLS
-- Run in Supabase SQL Editor if not already applied.

create table if not exists public.portfolio_content (
  id text primary key default 'main',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.media_registry (
  id uuid primary key default gen_random_uuid(),
  storage_path text unique not null,
  public_url text not null,
  mime_type text,
  file_size bigint,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists portfolio_content_updated on public.portfolio_content;
create trigger portfolio_content_updated
  before update on public.portfolio_content
  for each row execute function public.set_updated_at();

insert into public.portfolio_content (id, data)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

alter table public.portfolio_content enable row level security;
alter table public.media_registry enable row level security;

drop policy if exists "Public read portfolio" on public.portfolio_content;
create policy "Public read portfolio"
  on public.portfolio_content for select using (true);

drop policy if exists "Admin insert portfolio" on public.portfolio_content;
create policy "Admin insert portfolio"
  on public.portfolio_content for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "Admin update portfolio" on public.portfolio_content;
create policy "Admin update portfolio"
  on public.portfolio_content for update
  using (auth.role() = 'authenticated');

drop policy if exists "Public read media registry" on public.media_registry;
create policy "Public read media registry"
  on public.media_registry for select using (true);

drop policy if exists "Admin insert media registry" on public.media_registry;
create policy "Admin insert media registry"
  on public.media_registry for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "Admin delete media registry" on public.media_registry;
create policy "Admin delete media registry"
  on public.media_registry for delete
  using (auth.role() = 'authenticated');

-- Storage policies (bucket must exist: Portfolio-media, public read)
drop policy if exists "Public read media" on storage.objects;
create policy "Public read media"
  on storage.objects for select
  using (bucket_id = 'Portfolio-media');

drop policy if exists "Admin upload media" on storage.objects;
create policy "Admin upload media"
  on storage.objects for insert
  with check (
    bucket_id = 'Portfolio-media'
    and auth.role() = 'authenticated'
  );

drop policy if exists "Admin delete media" on storage.objects;
create policy "Admin delete media"
  on storage.objects for delete
  using (
    bucket_id = 'Portfolio-media'
    and auth.role() = 'authenticated'
  );
