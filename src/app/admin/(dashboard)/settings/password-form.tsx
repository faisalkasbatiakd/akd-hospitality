"use client";

import { useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";

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

import { changePassword } from "./actions";

/** One labelled password box with a show/hide toggle. */
function PasswordField({
  id,
  name,
  label,
  autoComplete,
  hint,
}: {
  id: string;
  name: string;
  label: string;
  autoComplete: string;
  hint?: string;
}) {
  const [shown, setShown] = useState(false);

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={shown ? "text" : "password"}
          autoComplete={autoComplete}
          required
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShown((v) => !v)}
          aria-label={shown ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted-foreground transition-colors hover:text-foreground"
        >
          {shown ? (
            <EyeOff className="size-4" aria-hidden />
          ) : (
            <Eye className="size-4" aria-hidden />
          )}
        </button>
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/**
 * Change the dashboard password.
 *
 * The current password is asked for even though you are already signed in: it
 * is what stops someone who finds the dashboard open on an unattended machine
 * from locking the real administrator out.
 */
export function PasswordForm({ email }: { email: string }) {
  const [busy, setBusy] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5 text-base">
          <KeyRound className="size-4 text-brand-accent" aria-hidden />
          Dashboard password
        </CardTitle>
        <CardDescription>
          For <span className="font-medium text-foreground">{email}</span>, the
          account used to sign in here.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          className="max-w-md space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const data = new FormData(form);
            setBusy(true);
            try {
              const result = await changePassword(data);
              if (result.ok) {
                toast.success("Password changed");
                form.reset();
              } else {
                toast.error(result.error);
              }
            } catch {
              toast.error("Could not save the change. Please try again.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <PasswordField
            id="current-password"
            name="current"
            label="Current password"
            autoComplete="current-password"
          />
          <PasswordField
            id="new-password"
            name="next"
            label="New password"
            autoComplete="new-password"
            hint="At least 10 characters. A phrase of a few unrelated words is both stronger and easier to remember than a short one with symbols in it."
          />
          <PasswordField
            id="confirm-password"
            name="confirm"
            label="Confirm new password"
            autoComplete="new-password"
          />

          <Button type="submit" disabled={busy}>
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Saving
              </>
            ) : (
              "Change password"
            )}
          </Button>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Store the new password somewhere safe before you sign out. There is
            no reset link: this dashboard deliberately has no &ldquo;forgot
            password&rdquo; email, so recovering a lost one needs whoever holds
            database access.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
