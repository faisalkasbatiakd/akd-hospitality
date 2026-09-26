import type { Metadata } from "next";

import { requireSession } from "@/lib/auth";
import { getSettings } from "@/lib/content";
import { Card, CardContent } from "@/components/ui/card";

import { PasswordForm } from "./password-form";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = { title: "Company details" };

export default async function SettingsPage() {
  const session = await requireSession();
  const settings = await getSettings();

  const block = (key: string) =>
    (settings[key] as Record<string, unknown> | undefined) ?? {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-brand-navy">
          Company details
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The name, symbol, contact details and standing text used across the
          website, including the footer and page metadata.
        </p>
      </div>

      <SettingsForm
        settingKey="company"
        title="Identity"
        description="Used in the footer, page titles, and the structured data search engines read."
        values={block("company")}
        fields={[
          { name: "name", label: "Company name", placeholder: "AKD Hospitality Limited" },
          {
            name: "formerName",
            label: "Former name",
            placeholder: "Formerly AKD Capital Limited",
            hint: "Optional. Shown under the name in the footer.",
          },
          { name: "symbol", label: "PSX symbol", placeholder: "AKDHL" },
          { name: "exchange", label: "Exchange", placeholder: "Pakistan Stock Exchange" },
          { name: "incorporated", label: "Incorporated", placeholder: "1936" },
          {
            name: "tagline",
            label: "Tagline",
            multiline: true,
            rows: 2,
            hint: "One sentence, used under page titles.",
          },
          {
            name: "intro",
            label: "Introduction",
            multiline: true,
            rows: 6,
            hint: "The company profile paragraph on the About page.",
          },
          { name: "vision", label: "Vision", multiline: true, rows: 3 },
          { name: "mission", label: "Mission", multiline: true, rows: 3 },
        ]}
      />

      <SettingsForm
        settingKey="contact"
        title="Contact details"
        description="Shown on the Contact page, in the footer, and in the notice a visitor sees if the enquiry form cannot reach us."
        values={block("contact")}
        fields={[
          { name: "person", label: "Contact person", placeholder: "Mr. Syed Haris Ahmed" },
          { name: "role", label: "Their role", placeholder: "Company Secretary" },
          {
            name: "address",
            label: "Registered office",
            list: true,
            rows: 4,
            hint: "One line per line of the address.",
          },
          { name: "phone", label: "Telephone", placeholder: "(92-21) 35302963" },
          { name: "fax", label: "Fax", placeholder: "(92-21) 35861662", hint: "Optional." },
          { name: "email", label: "General email", placeholder: "info@akdhospitality.com" },
          {
            name: "investorEmail",
            label: "Investor relations email",
            placeholder: "investor.relations@akdhospitality.com",
          },
        ]}
      />

      <SettingsForm
        settingKey="group"
        title="AKD Group"
        description="The parent group section on the home page."
        values={block("group")}
        fields={[
          { name: "title", label: "Heading", placeholder: "About AKD Group" },
          {
            name: "body",
            label: "Paragraphs",
            list: true,
            rows: 8,
            hint: "One paragraph per line. Blank lines are ignored.",
          },
        ]}
      />

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-5">
          <h2 className="text-sm font-medium text-amber-900">
            Not editable here
          </h2>
          <p className="mt-1.5 text-sm text-amber-900/85">
            The FY2025 figures, the six-year record, the shareholding pattern,
            the capital figures and the going-concern notice are audited numbers
            tied to pages of the annual report. They stay in the codebase, where
            changing one takes a commit and a review.
          </p>
        </CardContent>
      </Card>

      <PasswordForm email={session.email} />
    </div>
  );
}
