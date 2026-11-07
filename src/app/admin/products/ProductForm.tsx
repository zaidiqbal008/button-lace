import type { Category, Product } from "@/lib/types";
import { ImageField } from "./ImageField";
import { FormActions } from "./SubmitButton";

const CONTROL =
  "w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none transition placeholder:text-foreground/35 focus:border-primary focus:ring-4 focus:ring-primary/10";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="mb-4">
        <h2 className="font-display text-lg text-foreground">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-foreground/55">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <span className="mb-1.5 block text-sm font-medium text-foreground/80">
      {children}
      {required && <span className="ml-0.5 text-primary">*</span>}
    </span>
  );
}

function Field({
  name,
  label,
  type = "text",
  step,
  min,
  defaultValue,
  required,
  placeholder,
  hint,
  prefix,
}: {
  name: string;
  label: string;
  type?: string;
  step?: string;
  min?: string;
  defaultValue?: string | number;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  prefix?: string;
}) {
  return (
    <label className="block">
      <Label required={required}>{label}</Label>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-foreground/45">
            {prefix}
          </span>
        )}
        <input
          name={name}
          type={type}
          step={step}
          min={min}
          required={required}
          placeholder={placeholder}
          defaultValue={defaultValue}
          inputMode={type === "number" ? "decimal" : undefined}
          className={`${CONTROL} ${prefix ? "pl-11" : ""} ${type === "number" ? "tabular-nums" : ""}`}
        />
      </div>
      {hint && <p className="mt-1.5 text-xs text-foreground/50">{hint}</p>}
    </label>
  );
}

function Toggle({
  name,
  label,
  description,
  defaultChecked,
}: {
  name: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3.5 transition hover:bg-surface-muted/40">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-primary"
      />
      <span className="min-w-0">
        <span className="block text-sm font-medium text-foreground">{label}</span>
        <span className="block text-xs text-foreground/55">{description}</span>
      </span>
    </label>
  );
}

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
    <form action={action} className="space-y-5">
      <Section title="Details" description="What the product is called and where it sits in the shop.">
        <Field
          name="name"
          label="Product name"
          defaultValue={product?.name}
          placeholder="e.g. Pearl Accent Lace Trim"
          required
        />

        <label className="block">
          <Label>Category</Label>
          <select
            name="category_id"
            defaultValue={product?.category_id ?? defaultCategoryId ?? ""}
            className={CONTROL}
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <Label>Description</Label>
          <textarea
            name="description"
            rows={4}
            defaultValue={product?.description ?? ""}
            placeholder="Material, width, colour options, care notes…"
            className={`${CONTROL} resize-y`}
          />
        </label>
      </Section>

      <Section title="Pricing" description="Set a compare-at price to show a discount on the storefront.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            name="price"
            label="Price"
            type="number"
            step="0.01"
            min="0"
            prefix="Rs."
            placeholder="0"
            defaultValue={product?.price}
            required
          />
          <Field
            name="compare_at_price"
            label="Compare-at price"
            type="number"
            step="0.01"
            min="0"
            prefix="Rs."
            placeholder="Optional"
            defaultValue={product?.compare_at_price ?? undefined}
            hint="Shown struck through next to the price."
          />
        </div>
      </Section>

      <Section title="Photo" description="One clear image on a plain background works best.">
        <ImageField currentUrl={product?.image_url} />
        <input type="hidden" name="current_image_url" value={product?.image_url ?? ""} />
      </Section>

      <Section title="Inventory & visibility">
        <Field
          name="stock"
          label="Stock"
          type="number"
          min="0"
          defaultValue={product?.stock ?? 0}
          hint="Set to 0 to mark the product out of stock."
          required
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle
            name="is_dyeable"
            label="Dyeable"
            description="Customers can request a custom colour."
            defaultChecked={product?.is_dyeable}
          />
          <Toggle
            name="is_active"
            label="Active"
            description="Visible to customers in the shop."
            defaultChecked={product?.is_active ?? true}
          />
        </div>
      </Section>

      <FormActions label={product ? "Save changes" : "Create product"} />
    </form>
  );
}
