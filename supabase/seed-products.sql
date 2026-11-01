-- Temporary sample products.
-- Images are free-licence Pexels photos stored in public/products/.
-- Run in the Supabase SQL editor after schema.sql.
-- Delete these rows from /admin once real products are added.

insert into products (category_id, name, slug, description, price, compare_at_price, image_url, stock, is_dyeable)
values
  ((select id from categories where slug = 'laces'),
   'Sequin Appliqué Net Lace', 'sequin-applique-net-lace',
   'Sheer net with gold sequin floral appliqué. Sold per yard.',
   1250, 1500, '/products/lace-sequin-net.jpg', 20, false),

  ((select id from categories where slug = 'laces'),
   'Pearl Accent Lace Trim', 'pearl-accent-lace-trim',
   'Fine eyelash lace trim with pearl detailing, ideal for necklines and cuffs.',
   720, null, '/products/lace-pearl-trim.jpg', 32, false),

  ((select id from categories where slug = 'laces'),
   'Black Chantilly Lace', 'black-chantilly-lace',
   'Classic floral chantilly lace in deep black. Soft drape, per yard.',
   890, 1100, '/products/lace-chantilly.jpg', 16, false),

  ((select id from categories where slug = 'dupattas'),
   'Printed Cotton Dupatta', 'printed-cotton-dupatta',
   'Lightweight cotton dupatta in warm rust with an all-over block print.',
   2400, 2900, '/products/dupatta-printed.jpg', 14, false),

  ((select id from categories where slug = 'dupattas'),
   'Embroidered Net Dupatta', 'embroidered-net-dupatta',
   'Sheer net dupatta with an embroidered scalloped border.',
   3100, null, '/products/dupatta-embroidered-net.jpg', 9, false),

  ((select id from categories where slug = 'dupattas'),
   'Pleated Organza Dupatta', 'pleated-organza-dupatta',
   'Soft gold organza with fine permanent pleating. Takes dye evenly.',
   2750, 3200, '/products/dupatta-organza-pleat.jpg', 11, true)
on conflict (slug) do nothing;
