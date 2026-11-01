-- Product image storage. Run once in the Supabase SQL editor.

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public can read product images" on storage.objects
  for select using (bucket_id = 'product-images');

create policy "Admins can upload product images" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images');

create policy "Admins can replace product images" on storage.objects
  for update to authenticated using (bucket_id = 'product-images');

create policy "Admins can delete product images" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images');
