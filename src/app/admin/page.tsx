import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { DeleteProductButton } from "./DeleteProductButton";

const LOW_STOCK = 10;

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl text-foreground tabular-nums">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-foreground/50">{hint}</p>}
    </div>
  );
}

function Thumb({ product, size }: { product: Product; size: number }) {
  return (
    <div
      className="shrink-0 overflow-hidden rounded-lg bg-surface-muted ring-1 ring-border"
      style={{ width: size, height: size }}
    >
      {product.image_url ? (
        <Image
          src={product.image_url}
          alt={product.name}
          width={size * 2}
          height={size * 2}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-foreground/25">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M3 16l5-5 4 4 3-3 6 6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        active
          ? "bg-accent/15 text-accent-dark"
          : "bg-foreground/[0.07] text-foreground/50"
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${active ? "bg-accent" : "bg-foreground/30"}`}
      />
      {active ? "Active" : "Hidden"}
    </span>
  );
}

function StockCell({ stock }: { stock: number }) {
  const out = stock <= 0;
  const low = !out && stock < LOW_STOCK;

  return (
    <span
      className={`tabular-nums ${
        out ? "font-semibold text-primary" : low ? "font-semibold text-gold" : "text-foreground"
      }`}
    >
      {out ? "Out of stock" : stock}
      {low && <span className="ml-1 text-xs font-normal text-foreground/50">low</span>}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
      <h2 className="font-display text-lg text-foreground">No products yet</h2>
      <p className="mx-auto mt-1 max-w-sm text-sm text-foreground/60">
        Add your first product and it will show up in the shop right away.
      </p>
      <Link
        href="/admin/products/new"
        className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
      >
        <span aria-hidden="true">+</span> New product
      </Link>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  const items = (products ?? []) as Product[];
  const activeCount = items.filter((p) => p.is_active).length;
  const lowStock = items.filter((p) => p.stock > 0 && p.stock < LOW_STOCK).length;
  const outOfStock = items.filter((p) => p.stock <= 0).length;
  const inventoryValue = items.reduce((sum, p) => sum + p.price * Math.max(p.stock, 0), 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">Products</h1>
          <p className="mt-1 text-sm text-foreground/60">
            {items.length === 0
              ? "Nothing in the catalogue yet."
              : `${items.length} product${items.length === 1 ? "" : "s"} · ${activeCount} visible in the shop`}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
        >
          <span aria-hidden="true">+</span> New product
        </Link>
      </div>

      {items.length > 0 && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Products" value={String(items.length)} hint={`${activeCount} active`} />
          <StatCard label="Low stock" value={String(lowStock)} hint={`under ${LOW_STOCK} left`} />
          <StatCard label="Out of stock" value={String(outOfStock)} hint="needs restocking" />
          <StatCard label="Inventory value" value={formatPrice(inventoryValue)} hint="price × stock" />
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-border bg-surface md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface-muted/60">
                <tr className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                  <th scope="col" className="px-5 py-3">Product</th>
                  <th scope="col" className="px-5 py-3 text-right">Price</th>
                  <th scope="col" className="px-5 py-3 text-right">Stock</th>
                  <th scope="col" className="px-5 py-3">Status</th>
                  <th scope="col" className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((product) => (
                  <tr key={product.id} className="group transition hover:bg-surface-muted/40">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Thumb product={product} size={44} />
                        <div className="min-w-0">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="block truncate font-medium text-foreground hover:text-primary-dark"
                          >
                            {product.name}
                          </Link>
                          {product.is_dyeable && (
                            <span className="text-xs text-foreground/50">Dyeable</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="font-medium tabular-nums">{formatPrice(product.price)}</span>
                      {product.compare_at_price && (
                        <span className="ml-2 text-xs text-foreground/40 line-through tabular-nums">
                          {formatPrice(product.compare_at_price)}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <StockCell stock={product.stock} />
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge active={product.is_active} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="rounded-full px-3 py-1.5 text-sm font-medium text-foreground/70 transition hover:bg-surface-muted hover:text-foreground"
                        >
                          Edit
                        </Link>
                        <DeleteProductButton productId={product.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="space-y-3 md:hidden">
            {items.map((product) => (
              <li
                key={product.id}
                className="flex gap-3 rounded-2xl border border-border bg-surface p-3"
              >
                <Thumb product={product} size={60} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="font-medium text-foreground"
                    >
                      {product.name}
                    </Link>
                    <StatusBadge active={product.is_active} />
                  </div>
                  <p className="mt-1 text-sm text-foreground/70 tabular-nums">
                    {formatPrice(product.price)}
                    <span className="mx-1.5 text-foreground/30">·</span>
                    <StockCell stock={product.stock} />
                  </p>
                  <div className="mt-2 flex items-center gap-1">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="rounded-full bg-surface-muted px-3 py-1.5 text-sm font-medium text-foreground"
                    >
                      Edit
                    </Link>
                    <DeleteProductButton productId={product.id} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
