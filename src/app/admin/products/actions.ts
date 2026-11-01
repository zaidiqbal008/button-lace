"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  const name = String(formData.get("name") || "");
  const { error } = await supabase.from("products").insert({
    name,
    slug: slugify(name),
    category_id: String(formData.get("category_id") || "") || null,
    description: String(formData.get("description") || "") || null,
    price: Number(formData.get("price") || 0),
    compare_at_price: formData.get("compare_at_price")
      ? Number(formData.get("compare_at_price"))
      : null,
    image_url: String(formData.get("image_url") || "") || null,
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
      image_url: String(formData.get("image_url") || "") || null,
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
