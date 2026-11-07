import Link from "next/link";
import { getCategories } from "@/lib/queries";
import { ProductForm } from "../ProductForm";
import { LivePreview } from "../LivePreview";
import { createProduct } from "../actions";

export default async function NewProductPage(
  props: PageProps<"/admin/products/new">
) {
  const [categories, searchParams] = await Promise.all([
    getCategories(),
    props.searchParams,
  ]);

  const requested = searchParams.category;
  const preselected = Array.isArray(requested) ? requested[0] : requested;

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin"
          className="text-sm font-medium text-foreground/55 transition hover:text-foreground"
        >
          ← Back to products
        </Link>
        <h1 className="mt-2 font-display text-3xl text-foreground">New product</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Add an item to the catalogue. It goes live as soon as it is active.
        </p>
      </div>
      <LivePreview
        initial={{
          name: "",
          price: 0,
          compareAt: null,
          stock: 0,
          isDyeable: false,
          isActive: true,
          imageUrl: null,
        }}
      >
        <ProductForm
          categories={categories}
          action={createProduct}
          defaultCategoryId={preselected}
        />
      </LivePreview>
    </div>
  );
}
