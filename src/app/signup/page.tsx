"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthScreen } from "@/components/AuthScreen";
import { customerSignUp } from "../(shop)/account/actions";

export default function CustomerSignUpPage() {
  const router = useRouter();

  return (
    <AuthScreen
      title="Create Account"
      subtitle="Join Stitch Bazaar to track your orders"
      submitLabel="Sign Up"
      withName
      onSubmit={async (formData) => {
        const result = await customerSignUp(formData);
        if (result.success) {
          router.push("/account");
          router.refresh();
        }
        return result;
      }}
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary-dark underline">
            Login
          </Link>
        </>
      }
      note="If email confirmation is on in Supabase, check your inbox before signing in."
    />
  );
}
