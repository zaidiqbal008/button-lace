"use client";

import { useRouter } from "next/navigation";
import { AuthScreen } from "@/components/AuthScreen";
import { signIn } from "./actions";

export default function AdminLoginPage() {
  const router = useRouter();

  return (
    <AuthScreen
      title="Admin Sign In"
      subtitle="Manage products, photos and orders"
      submitLabel="Login"
      onSubmit={async (formData) => {
        const result = await signIn(
          String(formData.get("email") || ""),
          String(formData.get("password") || "")
        );
        if (result.success) {
          router.push("/admin");
          router.refresh();
        }
        return result;
      }}
      note="Admin accounts are created in Supabase → Authentication → Users."
    />
  );
}
