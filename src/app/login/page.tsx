"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthScreen } from "@/components/AuthScreen";
import { customerSignIn } from "../(shop)/account/actions";

export default function CustomerLoginPage() {
  const router = useRouter();

  return (
    <AuthScreen
      title="Welcome Back!"
      subtitle="Sign in to continue to Stitch Bazaar"
      submitLabel="Login"
      onSubmit={async (formData) => {
        const result = await customerSignIn(formData);
        if (result.success) {
          router.push("/account");
          router.refresh();
        }
        return result;
      }}
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-primary-dark underline">
            Sign Up
          </Link>
        </>
      }
    />
  );
}
