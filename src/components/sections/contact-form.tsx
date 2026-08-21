"use client";

import { useRef, useState } from "react";
import { CheckCircle2, Loader2, Send, TriangleAlert, X } from "lucide-react";

import { company } from "@/data/company";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/**
 * Web3Forms access key.
 *
 * Set NEXT_PUBLIC_WEB3FORMS_KEY in the environment. The key is public by
 * design - Web3Forms identifies the destination inbox by it and rate limits on
 * their side - so exposing it in the bundle is expected, not a leak.
 *
 * With no key configured the form still renders and still validates, but a
 * submission is reported as undeliverable with the Company's email address
 * offered instead. A contact form must never silently swallow a message.
 */
const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

const ENDPOINT = "https://api.web3forms.com/submit";

type Status = "idle" | "submitting" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!accessKey) {
      setStatus("error");
      setErrorMessage(
        `The enquiry form is not connected yet. Please email us at ${company.contact.email} and we will respond.`,
      );
      return;
    }

    setStatus("submitting");
    setErrorMessage(null);

    const data = new FormData(form);
    data.append("access_key", accessKey);
    // Shown as the email subject in the destination inbox.
    data.append(
      "subject",
      `Website enquiry: ${String(data.get("enquirySubject") ?? "General")}`,
    );
    data.append("from_name", "AKD Hospitality website");

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      const result: { success?: boolean; message?: string } =
        await response.json();

      if (response.ok && result.success) {
        form.reset();
        setStatus("idle");
        dialogRef.current?.showModal();
        return;
      }

      // Never surface the service's own message to a visitor - a
      // misconfigured key produces text like "Invalid form_id/access_key
      // format", which tells them nothing they can act on. Log it for us and
      // show them the one thing that always works instead.
      if (process.env.NODE_ENV !== "production") {
        console.error("Web3Forms rejected the submission:", result.message);
      }
      setStatus("error");
      setErrorMessage(
        `We could not send your message just now. Please email us at ${company.contact.email} and we will respond.`,
      );
    } catch {
      setStatus("error");
      setErrorMessage(
        `We could not reach the mail service. Please check your connection, or email us at ${company.contact.email}.`,
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
        className="modal m-auto w-[min(28rem,calc(100vw-2rem))] rounded-2xl border border-border bg-background p-0 text-left shadow-2xl backdrop:backdrop-blur-sm"
        aria-labelledby="contact-thanks-title"
      >
        <div className="p-6 lg:p-7">
          <div className="flex items-start justify-between gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <CheckCircle2 className="size-6" aria-hidden />
            </span>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close"
              className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors duration-300 hover:bg-accent hover:text-brand-navy"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>

          <h2
            id="contact-thanks-title"
            className="mt-5 text-xl font-medium text-brand-navy"
          >
            Thank you for your message
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/75">
            Your enquiry has been sent to the Company Secretary. We will respond
            to the email address you provided. For shareholder matters you can
            also contact our Share Registrar directly.
          </p>

          <Button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="mt-6 w-full bg-brand-navy text-white transition-colors duration-300 hover:bg-brand-accent"
          >
            Close
          </Button>
        </div>
      </dialog>
    </>
  );
}
