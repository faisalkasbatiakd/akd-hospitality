"use client";

import { useRef, useState } from "react";
import { CheckCircle2, Loader2, Send, TriangleAlert, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/**
 * Enquiries post to our own route, which sends the mail through Resend.
 *
 * The Resend API key is a secret and stays server side, so there is nothing to
 * read here to decide whether the form is connected - the route answers 503
 * when the key is missing, and that is handled below.
 *
 * With no key configured the form still renders and still validates, but a
 * submission is reported as undeliverable with the Company's email address
 * offered instead. A contact form must never silently swallow a message.
 */
const ENDPOINT = "/api/contact";

type Status = "idle" | "submitting" | "error";

/**
 * The fallback address is passed in rather than imported: this is a client
 * component, and the value now lives in the database.
 */
export function ContactForm({ contactEmail }: { contactEmail: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    setStatus("submitting");
    setErrorMessage(null);

    const data = new FormData(form);
    const payload = Object.fromEntries(
      Array.from(data.entries(), ([key, value]) => [key, String(value)]),
    );

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const result: { ok?: boolean; error?: string } = await response
        .json()
        .catch(() => ({}));

      if (response.ok && result.ok) {
        form.reset();
        setStatus("idle");
        dialogRef.current?.showModal();
        return;
      }

      // Never surface the service's own error to a visitor: a missing key or an
      // unverified domain tells them nothing they can act on. Log it for us and
      // show them the one thing that always works instead.
      if (process.env.NODE_ENV !== "production") {
        console.error("Enquiry not sent:", response.status, result.error);
      }
      setStatus("error");
      setErrorMessage(
        response.status === 503
          ? `The enquiry form is not connected yet. Please email us at ${contactEmail} and we will respond.`
          : `We could not send your message just now. Please email us at ${contactEmail} and we will respond.`,
      );
    } catch {
      setStatus("error");
      setErrorMessage(
        `We could not reach the mail service. Please check your connection, or email us at ${contactEmail}.`,
      );
    }
  }

  const submitting = status === "submitting";

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border p-6 lg:p-7"
      >
        {/*
          Web3Forms treats a filled "botcheck" field as spam. Hidden from both
          sighted users and screen readers, and taken out of the tab order.
        */}
        <input
          type="checkbox"
          name="botcheck"
          className="hidden"
          tabIndex={-1}
          aria-hidden
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              name="name"
              className="h-11 px-3.5"
              placeholder="Your full name"
              autoComplete="name"
              maxLength={120}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              className="h-11 px-3.5"
              placeholder="you@company.com"
              autoComplete="email"
              maxLength={160}
              required
            />
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              className="h-11 px-3.5"
              placeholder="+92 300 0000000"
              autoComplete="tel"
              maxLength={40}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="enquirySubject">Subject</Label>
            <Input
              id="enquirySubject"
              name="enquirySubject"
              className="h-11 px-3.5"
              placeholder="How can we help?"
              maxLength={160}
              required
            />
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            name="message"
            rows={6}
            /*
              The Textarea primitive sets `field-sizing: content`, which makes
              the box size to its content and ignore `rows` - an empty message
              field collapsed to 64px. An explicit min-height restores a
              sensible starting size while still letting it grow as you type.
            */
            className="min-h-40 px-3.5 py-3"
            placeholder="Write your message here..."
            minLength={20}
            maxLength={4000}
            required
          />
        </div>

        {status === "error" && errorMessage && (
          <div
            role="alert"
            className="mt-5 flex gap-3 rounded-xl border border-amber-300/70 bg-amber-50/60 p-4"
          >
            <TriangleAlert
              className="mt-0.5 size-4 shrink-0 text-amber-600"
              aria-hidden
            />
            <p className="text-sm leading-relaxed text-foreground/80">
              {errorMessage}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="bg-brand-accent text-white transition-colors duration-300 hover:bg-brand-accent/90 disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Sending
              </>
            ) : (
              <>
                <Send className="size-4" aria-hidden />
                Send enquiry
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground">
            We reply to the email address you provide.
          </p>
        </div>

        {/* Announced to assistive technology while the request is in flight. */}
        <p aria-live="polite" className="sr-only">
          {submitting ? "Sending your message." : ""}
        </p>
      </form>

      {/* Thank-you dialog */}
      <dialog
        ref={dialogRef}
        className="modal relative m-auto w-[min(27rem,calc(100vw-2rem))] rounded-2xl border border-border bg-background p-0 text-left shadow-2xl backdrop:bg-brand-navy-dark/40 backdrop:backdrop-blur-sm open:animate-in open:fade-in open:zoom-in-95 open:duration-200"
        aria-labelledby="contact-thanks-title"
      >
        {/* Close sits in the corner rather than beside the icon, so the icon
            and the heading can share one centred column. */}
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="Close"
          className="absolute top-3 right-3 grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-brand-navy"
        >
          <X className="size-4" aria-hidden />
        </button>

        <div className="px-6 pt-9 pb-6 text-center sm:px-8 sm:pt-10">
          {/* Concentric rings behind the tick, which reads as a moment of
              confirmation rather than a flat badge in the corner. */}
          <span className="relative mx-auto grid size-16 place-items-center">
            <span
              aria-hidden
              className="absolute inset-0 rounded-full bg-brand-accent/10"
            />
            <span
              aria-hidden
              className="absolute inset-2 rounded-full bg-brand-accent/15"
            />
            <CheckCircle2
              className="relative size-8 text-brand-accent"
              aria-hidden
            />
          </span>

          <h2
            id="contact-thanks-title"
            className="mt-5 text-xl font-semibold text-brand-navy"
          >
            Thank you for your message
          </h2>
          <p className="mx-auto mt-2.5 max-w-[34ch] text-sm leading-relaxed text-muted-foreground">
            Your enquiry has been sent to the Company Secretary. We will respond
            to the email address you provided.
          </p>

          <div className="mt-6 space-y-3">
            <Button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="w-full"
            >
              Close
            </Button>
            <p className="text-xs text-muted-foreground">
              For shareholder matters — transfers, dividends, folio details —
              contact the{" "}
              <a
                href="#share-registrar"
                onClick={() => dialogRef.current?.close()}
                className="font-medium text-brand-accent underline-offset-4 hover:underline"
              >
                Share Registrar
              </a>{" "}
              directly.
            </p>
          </div>
        </div>
      </dialog>
    </>
  );
}
