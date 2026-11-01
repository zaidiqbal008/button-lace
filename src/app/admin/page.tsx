import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { DeleteProductButton } from "./DeleteProductButton";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  const items = (products ?? []) as Product[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-foreground">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          + New product
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-muted text-foreground/60">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((product) => (
              <tr key={product.id} className="border-t border-border">
                <td className="flex items-center gap-3 px-4 py-3">
                  <div className="h-10 w-10 overflow-hidden rounded-md bg-surface-muted">
                    {product.image_url && (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  {product.name}
                </td>
                <td className="px-4 py-3">{formatPrice(product.price)}</td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      product.is_active
                        ? "bg-accent/15 text-accent-dark"
                        : "bg-foreground/10 text-foreground/50"
                    }`}
                  >
                    {product.is_active ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="mr-3 font-medium text-accent-dark hover:underline"
                  >
                    Edit
                  </Link>
                  <DeleteProductButton productId={product.id} />
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-foreground/50">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
