"use server";

import { createClient } from "@/lib/supabase/server";

export async function customerSignIn(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
  });
  if (error) return { error: error.message };
  return { success: true };
}

export async function customerSignUp(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
    options: {
      data: { full_name: String(formData.get("full_name") || "") },
    },
  });
  if (error) return { error: error.message };
  return { success: true };
}

export async function customerSignOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
