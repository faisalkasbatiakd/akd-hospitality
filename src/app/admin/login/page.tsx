import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
  // The dashboard must never be indexed, and this path should not leak into
  // search results.
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-secondary px-5 py-12">
      {/* Soft brand wash, kept behind the card and out of the way of text. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-32 size-[28rem] rounded-full bg-brand-accent/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-32 size-[24rem] rounded-full bg-brand-sky/10 blur-3xl"
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-7 flex animate-in flex-col items-center text-center fade-in slide-in-from-bottom-1 duration-500">
          <Image
            src="/akd-logo-navy.png"
            alt="AKD Hospitality Limited"
            width={87}
            height={54}
            priority
            className="h-10 w-auto"
          />
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-accent">
            AKD Hospitality Limited
          </p>
          <h1 className="mt-1 text-xl font-semibold text-brand-navy">
            Content dashboard
          </h1>
        </div>

        {/*
          The form reads ?next= with useSearchParams, which opts a component
          out of prerendering unless it sits behind a Suspense boundary. Without
          this the production build fails on this page.
        */}
        <Suspense
          fallback={
            <div className="space-y-4 rounded-2xl border border-border bg-background p-6 shadow-sm">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>

        <div className="mt-6 flex animate-in flex-col items-center gap-3 text-xs text-muted-foreground fade-in duration-700">
          <p className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-brand-accent" aria-hidden />
            Authorised staff only
          </p>
          <Link
            href="/"
            className="flex items-center gap-1.5 transition-colors hover:text-brand-navy"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            Back to the website
          </Link>
        </div>
      </div>
    </main>
  );
}
