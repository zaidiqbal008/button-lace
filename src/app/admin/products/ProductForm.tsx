import Image from "next/image";
import type { Category, Product } from "@/lib/types";

export function ProductForm({
  categories,
  product,
  action,
  defaultCategoryId,
}: {
  categories: Category[];
  product?: Product;
  action: (formData: FormData) => void;
  defaultCategoryId?: string;
}) {
  return (
    <form action={action} className="max-w-xl space-y-4">
      <Field name="name" label="Product name" defaultValue={product?.name} required />

      <label className="block text-sm">
        <span className="font-medium text-foreground/80">Category</span>
        <select
          name="category_id"
          defaultValue={product?.category_id ?? defaultCategoryId ?? ""}
          className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="">No category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="font-medium text-foreground/80">Description</span>
        <textarea
          name="description"
          rows={4}
          defaultValue={product?.description ?? ""}
          className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <Field name="price" label="Price (Rs.)" type="number" step="0.01" defaultValue={product?.price} required />
        <Field
          name="compare_at_price"
          label="Compare-at price (optional)"
          type="number"
          step="0.01"
          defaultValue={product?.compare_at_price ?? undefined}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm">
          <span className="font-medium text-foreground/80">Product photo</span>
          <input
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-white"
          />
        </label>
        <p className="text-xs text-foreground/60">JPEG, PNG, WebP or AVIF, up to 5 MB.</p>
        {product?.image_url && (
          <div className="flex items-center gap-3 pt-1">
            <Image
              src={product.image_url}
              alt={product.name}
              width={56}
              height={56}
              className="h-14 w-14 rounded-lg border border-border object-cover"
            />
            <span className="text-xs text-foreground/60">
              Current photo — choose a file only if you want to replace it.
            </span>
          </div>
        )}
        <input type="hidden" name="current_image_url" value={product?.image_url ?? ""} />
      </div>

      <Field name="stock" label="Stock" type="number" defaultValue={product?.stock ?? 0} required />

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_dyeable" defaultChecked={product?.is_dyeable} />
          Dyeable
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_active" defaultChecked={product?.is_active ?? true} />
          Active (visible in store)
        </label>
      </div>

      <button
        type="submit"
        className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
      >
        {product ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  step,
  defaultValue,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  step?: string;
  defaultValue?: string | number;
  required?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-foreground/80">{label}</span>
      <input
        name={name}
        type={type}
        step={step}
        required={required}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}
