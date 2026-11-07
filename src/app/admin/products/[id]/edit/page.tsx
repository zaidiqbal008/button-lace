import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/queries";
import type { Product } from "@/lib/types";
import { ProductForm } from "../../ProductForm";
import { LivePreview } from "../../LivePreview";
import { updateProduct } from "../../actions";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: product }, categories] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    getCategories(),
  ]);

  if (!product) notFound();

  const boundUpdate = updateProduct.bind(null, id);

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin"
          className="text-sm font-medium text-foreground/55 transition hover:text-foreground"
        >
          ← Back to products
        </Link>
        <h1 className="mt-2 font-display text-3xl text-foreground">Edit product</h1>
        <p className="mt-1 text-sm text-foreground/60">{(product as Product).name}</p>
      </div>
      <LivePreview
        initial={{
          name: (product as Product).name,
          price: (product as Product).price,
          compareAt: (product as Product).compare_at_price,
          stock: (product as Product).stock,
          isDyeable: (product as Product).is_dyeable,
          isActive: (product as Product).is_active,
          imageUrl: (product as Product).image_url,
        }}
      >
        <ProductForm categories={categories} product={product as Product} action={boundUpdate} />
      </LivePreview>
    </div>
  );
}
