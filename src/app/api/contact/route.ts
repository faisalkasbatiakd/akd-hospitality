import { NextResponse } from "next/server";

import { company } from "@/data/company";

/**
 * Contact form delivery via Resend.
 *
 * This has to be a server route: unlike the Web3Forms key it replaces, a Resend
 * API key is a secret. Putting it in a NEXT_PUBLIC_ variable would ship it in
 * the browser bundle and let anyone send mail as this domain.
 *
 * Env:
 *   RESEND_API_KEY   secret, server only. Never prefix with NEXT_PUBLIC_.
 *   CONTACT_TO       inbox that receives enquiries. Defaults to the published
 *                    address in the company record.
 *   CONTACT_FROM     verified sender. Resend will only accept a domain that has
 *                    been verified in the dashboard; until then the sandbox
 *                    sender onboarding@resend.dev works, but only to the address
 *                    that owns the Resend account.
 */
const RESEND_ENDPOINT = "https://api.resend.com/emails";

const TO = process.env.CONTACT_TO ?? company.contact.email;
const FROM =
  process.env.CONTACT_FROM ?? "AKD Hospitality website <onboarding@resend.dev>";

/** Longest value accepted per field, so a paste bomb cannot reach the mailer. */
const LIMITS = {
  name: 120,
  email: 200,
  phone: 60,
  enquirySubject: 160,
  message: 5000,
} as const;

type FieldName = keyof typeof LIMITS;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Header injection guard. A newline in a value that ends up in the subject line
 * would let a submitter append their own headers.
 */
const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Deliberately a 503 rather than a 500: nothing is broken, the form is
    // simply not connected yet, and the client shows the address instead.
    return NextResponse.json(
      { error: "not_configured" },
      { status: 503 },
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  // Honeypot: the form renders a hidden "botcheck" input that a person never
  // fills. Answer 200 so a bot cannot tell it was rejected.
  if (typeof payload.botcheck === "string" && payload.botcheck.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const values: Partial<Record<FieldName, string>> = {};
  for (const field of Object.keys(LIMITS) as FieldName[]) {
    const raw = payload[field];
    if (typeof raw !== "string") continue;
    const trimmed = raw.trim();
    if (trimmed.length > LIMITS[field]) {
      return NextResponse.json({ error: "too_long", field }, { status: 400 });
    }
    values[field] = trimmed;
  }

  if (!values.name || !values.email || !values.message) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  // Deliberately permissive: the browser has already run type="email"
  // validation, and this only needs to stop values that cannot be a header.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    return NextResponse.json({ error: "bad_email" }, { status: 400 });
  }

  const topic = oneLine(values.enquirySubject ?? "General");
  const rows: [string, string][] = [
    ["Name", values.name],
    ["Email", values.email],
    ["Phone", values.phone ?? "—"],
    ["Subject", topic],
  ];

  const html = [
    '<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:14px;color:#252525">',
    '<p style="margin:0 0 16px">An enquiry was submitted on the website.</p>',
    '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:20px">',
    ...rows.map(
      ([label, value]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#8e8e8e">${label}</td>` +
        `<td style="padding:4px 0">${escapeHtml(value)}</td></tr>`,
    ),
    "</table>",
    '<div style="white-space:pre-wrap;border-top:1px solid #dde5ec;padding-top:16px">',
    escapeHtml(values.message),
    "</div></div>",
  ].join("");

  const text = [
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    values.message,
  ].join("\n");

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        // Lets the recipient reply straight to the enquirer, while the envelope
        // sender stays on the verified domain.
        reply_to: values.email,
        subject: `Website enquiry: ${topic}`,
        html,
        text,
      }),
    });

    if (!response.ok) {
      // Resend's own message names the account and domain, so it is logged for
      // us and never returned to the visitor.
      const detail = await response.text();
      console.error("Resend rejected the enquiry:", response.status, detail);
      return NextResponse.json({ error: "send_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Could not reach Resend:", error);
    return NextResponse.json({ error: "unreachable" }, { status: 502 });
  }
}
