-- Create users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create food_items table
create table public.food_items (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  calories integer not null,
  protein decimal,
  carbs decimal,
  fat decimal,
  serving_size text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create meals table
create table public.meals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  date date not null,
  meal_type text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create meal_items table (junction table between meals and food_items)
create table public.meal_items (
  id uuid default gen_random_uuid() primary key,
  meal_id uuid references public.meals(id) on delete cascade not null,
  food_item_id uuid references public.food_items(id) on delete cascade not null,
  quantity decimal not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies
alter table public.profiles enable row level security;
alter table public.food_items enable row level security;
alter table public.meals enable row level security;
alter table public.meal_items enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Food items policies (public read, authenticated users can create)
create policy "Anyone can view food items"
  on public.food_items for select
  to authenticated
  using (true);

create policy "Authenticated users can create food items"
  on public.food_items for insert
  to authenticated
  with check (true);

-- Meals policies
create policy "Users can view their own meals"
  on public.meals for select
  using (auth.uid() = user_id);

create policy "Users can create their own meals"
  on public.meals for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own meals"
  on public.meals for update
  using (auth.uid() = user_id);

create policy "Users can delete their own meals"
  on public.meals for delete
  using (auth.uid() = user_id);

-- Meal items policies
create policy "Users can view their own meal items"
  on public.meal_items for select
  using (
    exists (
      select 1 from public.meals
      where meals.id = meal_items.meal_id
      and meals.user_id = auth.uid()
    )
  );

create policy "Users can create their own meal items"
  on public.meal_items for insert
  with check (
    exists (
      select 1 from public.meals
      where meals.id = meal_items.meal_id
      and meals.user_id = auth.uid()
    )
  );

create policy "Users can update their own meal items"
  on public.meal_items for update
  using (
    exists (
      select 1 from public.meals
      where meals.id = meal_items.meal_id
      and meals.user_id = auth.uid()
    )
  );

create policy "Users can delete their own meal items"
  on public.meal_items for delete
  using (
    exists (
      select 1 from public.meals
      where meals.id = meal_items.meal_id
      and meals.user_id = auth.uid()
    )
  );

-- Create functions for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

create trigger handle_food_items_updated_at
  before update on public.food_items
  for each row
  execute function public.handle_updated_at();

create trigger handle_meals_updated_at
  before update on public.meals
  for each row
  execute function public.handle_updated_at();

create trigger handle_meal_items_updated_at
  before update on public.meal_items
  for each row
  execute function public.handle_updated_at(); 