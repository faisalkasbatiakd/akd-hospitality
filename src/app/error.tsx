"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, Mail, RotateCcw, TriangleAlert } from "lucide-react";

import { company } from "@/data/company";

/**
 * Route-level error boundary.
 *
 * Deliberately plain: it must render even when something in the page tree has
 * already failed, so it uses no data files, no images and no scroll animations
 * beyond the shared design tokens. The header and footer still come from the
 * root layout, so a visitor keeps full navigation.
 *
 * The message says nothing about what broke. A stack trace or framework message
 * on a listed company's website tells a visitor nothing useful and tells anyone
 * probing the site more than it should.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Vercel captures console output from the client, so the digest is enough
    // to tie a visitor's report back to the server-side log entry.
    console.error("Unhandled route error", error.digest ?? error.message);
  }, [error]);

  return (
    <section className="bg-background">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-6 py-20">
        <span className="grid size-12 place-items-center rounded-xl bg-amber-50 text-amber-600">
          <TriangleAlert className="size-6" aria-hidden />
        </span>

        <h1 className="mt-7 text-[2rem] font-semibold leading-tight tracking-tight text-brand-navy sm:text-4xl">
          Something went wrong
        </h1>

        <span className="mt-5 block h-1 w-20 rounded-full bg-brand-accent" />

        <p className="mt-6 text-[15px] leading-relaxed text-foreground/75">
          This page could not be displayed. The problem has been logged. Please
          try again, or use the links below to continue.
        </p>

        {error.digest && (
          <p className="mt-4 text-xs text-muted-foreground">
            Reference: <span className="font-mono">{error.digest}</span>
          </p>
        )}

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-brand-accent"
          >
            <RotateCcw className="size-4" aria-hidden />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-brand-navy transition-colors duration-300 hover:border-brand-accent/50 hover:bg-brand-accent/[0.04]"
          >
            <Home className="size-4" aria-hidden />
            Back to home
          </Link>
          <a
            href={`mailto:${company.contact.email}`}
            className="-my-2 inline-flex items-center gap-2 py-2 text-sm font-medium [overflow-wrap:anywhere] text-brand-accent underline-offset-4 transition-colors duration-300 hover:text-brand-navy hover:underline"
          >
            <Mail className="size-4 shrink-0" aria-hidden />
            {company.contact.email}
          </a>
        </div>
      </div>
    </section>
  );
}
