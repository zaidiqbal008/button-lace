"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

async function resolveImageUrl(supabase: SupabaseClient, formData: FormData) {
  const current = String(formData.get("current_image_url") || "") || null;
  const file = formData.get("image");

  if (!(file instanceof File) || file.size === 0) {
    return current;
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Image must be a JPEG, PNG, WebP or AVIF file.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be 5 MB or smaller.");
  }

  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { contentType: file.type });

  if (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }

  return supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  const name = String(formData.get("name") || "");
  const imageUrl = await resolveImageUrl(supabase, formData);
  const { error } = await supabase.from("products").insert({
    name,
    slug: slugify(name),
    category_id: String(formData.get("category_id") || "") || null,
    description: String(formData.get("description") || "") || null,
    price: Number(formData.get("price") || 0),
    compare_at_price: formData.get("compare_at_price")
      ? Number(formData.get("compare_at_price"))
      : null,
    image_url: imageUrl,
    stock: Number(formData.get("stock") || 0),
    is_dyeable: formData.get("is_dyeable") === "on",
    is_active: formData.get("is_active") !== "off",
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/products");
  redirect("/admin");
}

export async function updateProduct(productId: string, formData: FormData) {
  const supabase = await createClient();

  const name = String(formData.get("name") || "");
  const imageUrl = await resolveImageUrl(supabase, formData);
  const { error } = await supabase
    .from("products")
    .update({
      name,
      slug: slugify(name),
      category_id: String(formData.get("category_id") || "") || null,
      description: String(formData.get("description") || "") || null,
      price: Number(formData.get("price") || 0),
      compare_at_price: formData.get("compare_at_price")
        ? Number(formData.get("compare_at_price"))
        : null,
      image_url: imageUrl,
      stock: Number(formData.get("stock") || 0),
      is_dyeable: formData.get("is_dyeable") === "on",
      is_active: formData.get("is_active") !== "off",
    })
    .eq("id", productId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/products");
  redirect("/admin");
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", productId);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/admin");
  revalidatePath("/products");
}
