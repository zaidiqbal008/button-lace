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
      className="whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-sm font-medium text-foreground/70 transition hover:border-primary-light hover:text-foreground"
    >
      Sign out
    </button>
  );
}
