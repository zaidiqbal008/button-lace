"use client";

import { useRouter } from "next/navigation";
import { customerSignOut } from "./actions";

export function SignOutButton() {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await customerSignOut();
        router.push("/");
        router.refresh();
      }}
      className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-primary-light"
    >
      Sign out
    </button>
  );
}
