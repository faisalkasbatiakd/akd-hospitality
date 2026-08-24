"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  TriangleAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(data.get("email") ?? ""),
          password: String(data.get("password") ?? ""),
        }),
      });

      if (response.ok) {
        // Only ever an internal path: taken from our own redirect, and checked
        // so a crafted ?next=https://... cannot bounce the admin off-site.
        const next = params.get("next");
        router.replace(next?.startsWith("/admin") ? next : "/admin");
        return;
      }

      setError(
        response.status === 401
          ? "That email and password do not match."
          : "Could not sign in just now. Please try again.",
      );
    } catch {
      setError("Could not reach the server. Check that it is running.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Use the credentials issued to you to manage the website’s content.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username"
                autoFocus
                placeholder="Enter your email"
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                className="pl-9 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                // Not in the tab order: it is a convenience, and tabbing from
                // the password field should reach the submit button.
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-1 grid size-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="size-4" aria-hidden />
                ) : (
                  <Eye className="size-4" aria-hidden />
                )}
              </button>
            </div>
          </div>

          {error ? (
            <p
              role="alert"
              className="flex animate-in items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 fade-in slide-in-from-top-1 duration-300"
            >
              <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
              {error}
            </p>
          ) : null}

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Signing in
              </>
            ) : (
              <>
                Sign in
                <ArrowRight className="size-4" aria-hidden />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
