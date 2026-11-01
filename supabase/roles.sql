-- Customer accounts + admin role separation.
-- Run in the Supabase SQL editor AFTER schema.sql and storage.sql.
--
-- Before this migration every authenticated user had admin rights. Existing
-- users are therefore kept as admins; new sign-ups default to 'customer'.

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- A customer may read their own profile. Nobody may change their own role.
drop policy if exists "Users read own profile" on profiles;
create policy "Users read own profile" on profiles
  for select using (auth.uid() = id);

create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

drop policy if exists "Admins read all profiles" on profiles;
create policy "Admins read all profiles" on profiles
  for select using (is_admin());

-- Give every new sign-up a customer profile.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Preserve existing access: anyone who already had an account was an admin.
insert into profiles (id, role)
select id, 'admin' from auth.users
on conflict (id) do nothing;

-- Promote a specific account to admin. Accounts created AFTER this file was
-- last run default to 'customer', so edit the email and re-run this statement.
update profiles set role = 'admin'
where id = (select id from auth.users where email = 'zaid99iqbal@gmail.com');

-- Catalog: admin-only writes ------------------------------------------------

drop policy if exists "Admins can manage categories" on categories;
create policy "Admins manage categories" on categories
  for all using (is_admin()) with check (is_admin());

drop policy if exists "Admins can manage products" on products;
create policy "Admins manage products" on products
  for all using (is_admin()) with check (is_admin());

-- Orders: admins see everything, customers see only their own ---------------

alter table orders add column if not exists user_id uuid references auth.users(id) on delete set null;

drop policy if exists "Admins can read orders" on orders;
drop policy if exists "Admins can update orders" on orders;
drop policy if exists "Admins read all orders" on orders;
drop policy if exists "Customers read own orders" on orders;

create policy "Admins read all orders" on orders
  for select using (is_admin());

create policy "Customers read own orders" on orders
  for select using (auth.uid() is not null and auth.uid() = user_id);

create policy "Admins update orders" on orders
  for update using (is_admin());

drop policy if exists "Admins can read order items" on order_items;
drop policy if exists "Admins read all order items" on order_items;
drop policy if exists "Customers read own order items" on order_items;

create policy "Admins read all order items" on order_items
  for select using (is_admin());

create policy "Customers read own order items" on order_items
  for select using (
    exists (
      select 1 from orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

-- Product images: admin-only writes -----------------------------------------

drop policy if exists "Admins can upload product images" on storage.objects;
drop policy if exists "Admins can replace product images" on storage.objects;
drop policy if exists "Admins can delete product images" on storage.objects;

create policy "Admins upload product images" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images' and is_admin());

create policy "Admins replace product images" on storage.objects
  for update to authenticated using (bucket_id = 'product-images' and is_admin());

create policy "Admins delete product images" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images' and is_admin());
