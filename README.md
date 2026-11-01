# Stitch Bazaar

An e-commerce storefront for laces, dupattas, and trims, built with Next.js
(App Router) and Supabase.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind CSS)
- **Supabase** — Postgres database, Auth (admin login), Row Level Security
- Client-side cart (persisted to `localStorage`)
- Orders placed as cash-on-delivery / bank-transfer records (no payment
  gateway yet)

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In **Project Settings → API**, copy the **Project URL** and the
   **anon public key**.
3. Copy `.env.local.example` to `.env.local` and fill in those two values:

   ```bash
   cp .env.local.example .env.local
   ```

## 2. Set up the database

1. In the Supabase dashboard, open **SQL Editor → New query**.
2. Paste the contents of [`supabase/schema.sql`](./supabase/schema.sql) and
   run it. This creates the `categories`, `products`, `orders`, and
   `order_items` tables, sets up Row Level Security policies, and seeds three
   starter categories.

## 3. Create your admin account

The admin area (`/admin`) is protected by Supabase Auth. Any authenticated
user can manage products and view orders (this is a single-admin setup).

1. In the Supabase dashboard, go to **Authentication → Users → Add user**.
2. Create a user with your email and a password.
3. Sign in at `/admin/login` with those credentials.

## 4. Run the app

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the storefront, and
[http://localhost:3000/admin](http://localhost:3000/admin) to manage products
and view orders.

## Project structure

- `src/app` — storefront pages (home, products, categories, cart, checkout)
  and the `/admin` area
- `src/lib/supabase` — browser/server Supabase clients and the middleware
  that refreshes auth sessions and protects `/admin`
- `src/lib/queries.ts` — storefront data fetching (categories, products)
- `src/lib/cart-context.tsx` — client-side cart state
- `supabase/schema.sql` — database schema, RLS policies, and seed data

## Notes

- Product images are set via a URL field in the admin form (e.g. a link to an
  image uploaded to Supabase Storage or any public image host).
- There's no payment gateway integration yet — checkout records an order in
  Supabase for cash-on-delivery or bank transfer, to be fulfilled manually.
