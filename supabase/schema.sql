-- PrepForge data schema (Supabase / Postgres). Apply once in the Supabase SQL editor when accounts launch.
-- Row Level Security is on for every table: people can only write their own rows.
create table users (id uuid primary key references auth.users on delete cascade, handle text unique, name text, avatar_url text, allergies text, diet text, servings int default 2, pro_until timestamptz, created_at timestamptz default now());
create table recipes (id text primary key, author_id uuid references users, title text not null, blurb text, meal text check (meal in ('breakfast','lunch','dinner','snack')), cuisine text, minutes int, servings int, kcal int, protein int, level text, moment text,
  ingredients jsonb not null default '[]', steps jsonb not null default '[]', tags text[] default '{}', remix_of text references recipes,
  video_instagram text, video_tiktok text, video_snapchat text, video_facebook text, video_youtube text, video_x text, video_reddit text, created_at timestamptz default now());
create table saves (user_id uuid references users on delete cascade, recipe_id text references recipes on delete cascade, created_at timestamptz default now(), primary key (user_id, recipe_id));
create table follows (follower uuid references users on delete cascade, followee uuid references users on delete cascade, created_at timestamptz default now(), primary key (follower, followee));
create table remixes (child text references recipes on delete cascade, parent text references recipes on delete cascade, primary key (child, parent));
create table pantry_items (user_id uuid references users on delete cascade, item text, primary key (user_id, item));
create table shopping_lists (id uuid primary key default gen_random_uuid(), user_id uuid references users on delete cascade, household_id uuid, items jsonb not null default '[]', updated_at timestamptz default now());
create table daily_curations (date date primary key, country text, picks jsonb not null, curated_by text, created_at timestamptz default now());
create table comments (id uuid primary key default gen_random_uuid(), recipe_id text references recipes on delete cascade, step int, parent_id uuid references comments on delete cascade, user_id uuid references users on delete cascade, body text not null check (length(body) <= 2000), created_at timestamptz default now());
create table cook_sessions (id uuid primary key default gen_random_uuid(), user_id uuid references users on delete cascade, recipe_id text references recipes, cooked_at timestamptz default now(), rating int);

alter table users enable row level security; alter table recipes enable row level security; alter table saves enable row level security; alter table follows enable row level security;
alter table remixes enable row level security; alter table pantry_items enable row level security; alter table shopping_lists enable row level security; alter table daily_curations enable row level security;
alter table comments enable row level security; alter table cook_sessions enable row level security;
create policy "public read" on users for select using (true);
create policy "self write" on users for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "public read" on recipes for select using (true);
create policy "author write" on recipes for all using (auth.uid() = author_id) with check (auth.uid() = author_id);
create policy "own saves" on saves for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "public read" on follows for select using (true);
create policy "own follows" on follows for all using (auth.uid() = follower) with check (auth.uid() = follower);
create policy "public read" on remixes for select using (true);
create policy "own pantry" on pantry_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own lists" on shopping_lists for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "public read" on daily_curations for select using (true);
create policy "public read" on comments for select using (true);
create policy "own comments" on comments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own cooks" on cook_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
