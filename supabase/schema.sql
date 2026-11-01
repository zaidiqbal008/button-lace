-- Run this in the Supabase SQL editor (Project > SQL Editor > New query)
-- after creating your project.

create extension if not exists "pgcrypto";

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  compare_at_price numeric(10, 2),
  image_url text,
  stock integer not null default 0,
  is_dyeable boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address text not null,
  city text not null,
  notes text,
  payment_method text not null default 'cod' check (payment_method in ('cod', 'bank_transfer')),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  total numeric(10, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  unit_price numeric(10, 2) not null,
  quantity integer not null check (quantity > 0)
);

-- Row Level Security -----------------------------------------------------

alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Anyone can browse the catalog.
create policy "Public can read categories" on categories
  for select using (true);

create policy "Public can read active products" on products
  for select using (is_active = true);

-- Only signed-in admins (any authenticated user in this single-admin setup)
-- can manage the catalog.
create policy "Admins can manage categories" on categories
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admins can manage products" on products
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Customers (anonymous) can place orders, but cannot read them back.
create policy "Anyone can create an order" on orders
  for insert with check (true);

create policy "Admins can read orders" on orders
  for select using (auth.role() = 'authenticated');

create policy "Admins can update orders" on orders
  for update using (auth.role() = 'authenticated');

create policy "Anyone can create order items" on order_items
  for insert with check (true);

create policy "Admins can read order items" on order_items
  for select using (auth.role() = 'authenticated');

-- Seed data ---------------------------------------------------------------

insert into categories (name, slug, description) values
  ('Laces', 'laces', 'Dyeable and ready-made laces in organza, net, and pearl trims.'),
  ('Dupattas', 'dupattas', 'Plain and embellished dupattas ready for customization.'),
  ('Buttons & Trims', 'buttons-trims', 'Decorative buttons and finishing trims for tailoring.')
on conflict (slug) do nothing;
