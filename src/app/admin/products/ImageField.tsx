"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const MAX_MB = 5;

export function ImageField({ currentUrl }: { currentUrl?: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const shown = preview ?? currentUrl ?? null;

  function handleFile(file: File | undefined) {
    setError(null);

    if (!file) {
      setPreview(null);
      setFileName(null);
      return;
    }

    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`That file is ${(file.size / 1024 / 1024).toFixed(1)} MB. Maximum is ${MAX_MB} MB.`);
      if (inputRef.current) inputRef.current.value = "";
      setPreview(null);
      setFileName(null);
      return;
    }

    setPreview(URL.createObjectURL(file));
    setFileName(file.name);
  }

  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-foreground/80">Product photo</span>

      <div className="flex items-center gap-4 rounded-xl border border-dashed border-border bg-surface-muted/30 p-3">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-muted ring-1 ring-border">
          {shown ? (
            <Image src={shown} alt="" fill sizes="80px" className="object-cover" unoptimized={!!preview} />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-foreground/25">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M3 16l5-5 4 4 3-3 6 6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-medium text-foreground transition hover:border-primary-light"
            >
              {shown ? "Replace photo" : "Choose photo"}
            </button>
            {fileName && (
              <button
                type="button"
                onClick={() => {
                  if (inputRef.current) inputRef.current.value = "";
                  handleFile(undefined);
                }}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-foreground/50 transition hover:text-primary"
              >
                Remove
              </button>
            )}
          </div>

          <p className="mt-1.5 truncate text-xs text-foreground/50">
            {fileName
              ? fileName
              : currentUrl
                ? "Current photo — choose a file only to replace it."
                : `JPEG, PNG, WebP or AVIF, up to ${MAX_MB} MB.`}
          </p>
          {error && <p className="mt-1 text-xs font-medium text-primary">{error}</p>}
        </div>
      </div>

      <input
        ref={inputRef}
        name="image"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
