"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useFormStatus } from "react-dom";

export type AuthResult = { error?: string; success?: boolean };

export function AuthScreen({
  title,
  subtitle,
  submitLabel,
  withName = false,
  onSubmit,
  footer,
  note,
}: {
  title: string;
  subtitle: string;
  submitLabel: string;
  withName?: boolean;
  onSubmit: (formData: FormData) => Promise<AuthResult>;
  footer?: React.ReactNode;
  note?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await onSubmit(formData);
    if (result.error) setError(result.error);
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-[#f3e9dd] lg:flex lg:flex-col lg:items-center lg:justify-center lg:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-[22rem] w-[22rem] rounded-full bg-[#e7d6c2]/70 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-20 h-[24rem] w-[24rem] rounded-full bg-[#dcc3a6]/60 blur-3xl"
        />
        <StitchButton aria-hidden className="absolute right-16 top-16 h-28 w-28 opacity-40" dot="h-3 w-3 gap-2" />
        <StitchButton aria-hidden className="absolute bottom-24 left-20 h-16 w-16 opacity-35" dot="h-1.5 w-1.5 gap-1.5" />

        <Link href="/" className="relative z-10 flex flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt="Stitch Bazaar"
            width={1701}
            height={773}
            className="w-full max-w-md"
            priority
          />
          <p className="mt-6 font-display text-xl italic text-primary-dark">
            Crafting Creativity, One Stitch at a Time
          </p>
        </Link>
      </aside>

      <main className="flex items-center justify-center bg-[#faf5ef] px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-border/60 bg-surface p-8 shadow-xl sm:p-10">
          <Link href="/" className="block lg:hidden">
            <Image
              src="/logo.png"
              alt="Stitch Bazaar"
              width={1701}
              height={773}
              className="mx-auto h-14 w-auto"
            />
          </Link>

          <h1 className="mt-6 text-center font-display text-3xl text-primary-dark lg:mt-0">
            {title}
          </h1>
          <p className="mt-2 text-center text-sm text-foreground/70">{subtitle}</p>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <StitchButton className="h-7 w-7" />
            <span className="h-px flex-1 bg-border" />
          </div>

          <form action={handleSubmit} className="space-y-4">
            {withName && (
              <FieldShell icon={<UserIcon />}>
                <input
                  name="full_name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Full Name"
                  aria-label="Full name"
                  className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-foreground/45"
                />
              </FieldShell>
            )}

            <FieldShell icon={<MailIcon />}>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                autoFocus={!withName}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                aria-label="Email address"
                className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-foreground/45"
              />
            </FieldShell>

            <FieldShell icon={<LockIcon />}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                autoComplete={withName ? "new-password" : "current-password"}
                placeholder="Password"
                aria-label="Password"
                className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-foreground/45"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="shrink-0 text-foreground/50 transition hover:text-primary-dark"
              >
                <EyeIcon off={!showPassword} />
              </button>
            </FieldShell>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700"
              >
                {error}
              </p>
            )}
            <SubmitButton label={submitLabel} />
          </form>

          {footer && (
            <div className="mt-6 text-center text-sm text-foreground/70">{footer}</div>
          )}
          {note && (
            <p className="mt-6 border-t border-border pt-5 text-center text-xs text-foreground/55">
              {note}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

function FieldShell({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-muted/60 px-4 focus-within:border-primary focus-within:bg-surface">
      {icon}
      {children}
    </div>
  );
}

function StitchButton({
  className = "",
  dot = "h-[3px] w-[3px] gap-[2px]",
  ...props
}: React.ComponentProps<"span"> & { dot?: string }) {
  const [h, w, gap] = dot.split(" ");
  return (
    <span
      {...props}
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-primary ring-1 ring-inset ring-primary-dark/25 ${className}`}
    >
      <span className={`grid grid-cols-2 ${gap}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className={`${h} ${w} rounded-full bg-primary-dark/60`} />
        ))}
      </span>
    </span>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="group flex w-full items-center justify-center gap-2 rounded-full bg-primary-dark px-6 py-3.5 font-display text-lg text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? (
        <>
          <Spinner />
          Please wait…
        </>
      ) : (
        <>
          {label}
          <span aria-hidden className="transition group-hover:translate-x-1">
            →
          </span>
        </>
      )}
    </button>
  );
}

function Spinner() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className="h-5 w-5 animate-spin">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.3" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const iconClass = "h-5 w-5 shrink-0 text-primary-dark";

function MailIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={iconClass}>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="m3.5 7 7.4 5.3a2 2 0 0 0 2.2 0L20.5 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={iconClass}>
      <rect x="4" y="10.5" width="16" height="10.5" rx="2.5" />
      <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={iconClass}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="m4 20 16-16" />}
    </svg>
  );
}
