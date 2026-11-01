"use client";

import { useRouter } from "next/navigation";
import { signOut } from "./login/actions";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await signOut();
        router.push("/admin/login");
        router.refresh();
      }}
      className="rounded-full border border-border px-3 py-1 hover:border-primary-light"
    >
      Sign out
    </button>
  );
}
