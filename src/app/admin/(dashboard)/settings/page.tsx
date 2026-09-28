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

  /*
   * Two blocks are not flat. `stats` is stored as a bare array and
   * `shareholderServices` nests its registrar. The forms work in flat fields,
   * so both are flattened here and put back into shape by the action on save.
   */
  const statsValues = { stats: settings.stats ?? [] };
  const services = block("shareholderServices");
  const registrar = (services.registrar ?? {}) as Record<string, unknown>;
  const serviceValues = {
    ...services,
    "registrar.name": registrar.name,
    "registrar.label": registrar.label,
    "registrar.address": registrar.address,
  };

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


      <SettingsForm
        settingKey="stats"
        title="Home page figures"
        description="The four figures across the top of the home page."
        values={statsValues}
        fields={[
          {
            name: "stats",
            label: "Figures",
            columns: [
              { key: "value", label: "Figure" },
              { key: "label", label: "Caption" },
            ],
          },
        ]}
      />

      <SettingsForm
        settingKey="currentStage"
        title="Overview section"
        description="The block below the hero on the home page."
        values={block("currentStage")}
        fields={[
          { name: "eyebrow", label: "Eyebrow" },
          { name: "heading", label: "Heading", multiline: true, rows: 2 },
          {
            name: "body",
            label: "Paragraphs",
            list: true,
            rows: 6,
            hint: "One paragraph per line.",
          },
          {
            name: "facts",
            label: "Facts",
            columns: [
              { key: "value", label: "Figure" },
              { key: "label", label: "Caption" },
            ],
          },
        ]}
      />

      <SettingsForm
        settingKey="chairpersonReview"
        title="Chairperson&rsquo;s review"
        description="Quoted from the annual report. Change the wording only if the report does."
        values={block("chairpersonReview")}
        fields={[
          { name: "eyebrow", label: "Eyebrow" },
          { name: "heading", label: "Heading", multiline: true, rows: 2 },
          {
            name: "quotes",
            label: "Paragraphs",
            list: true,
            rows: 6,
            hint: "One paragraph per line.",
          },
          { name: "pullQuote", label: "Pull quote", multiline: true, rows: 3 },
          { name: "signatory", label: "Signatory" },
          { name: "signatoryRole", label: "Their role" },
          { name: "place", label: "Place" },
          { name: "date", label: "Date" },
          {
            name: "boardFacts",
            label: "Board facts",
            columns: [
              { key: "value", label: "Figure" },
              { key: "label", label: "Caption" },
            ],
          },
        ]}
      />

      <SettingsForm
        settingKey="esgHeader"
        title="ESG section heading"
        description="The introduction above the ESG framework on the About page."
        values={block("esgHeader")}
        fields={[
          { name: "eyebrow", label: "Eyebrow" },
          { name: "heading", label: "Heading" },
          { name: "intro", label: "Introduction", multiline: true, rows: 5 },
        ]}
      />

      <SettingsForm
        settingKey="investorPanel"
        title="Investor panel"
        description="The investor relations block on the home page."
        values={block("investorPanel")}
        fields={[
          { name: "eyebrow", label: "Eyebrow" },
          { name: "heading", label: "Heading" },
          { name: "body", label: "Body", multiline: true, rows: 3 },
          { name: "ctaLabel", label: "Button label" },
          {
            name: "ctaHref",
            label: "Button link",
            hint: "A path on this site, such as /investors.",
          },
        ]}
      />

      <SettingsForm
        settingKey="electionOfDirectors"
        title="Election of directors"
        description="On the Governance page."
        values={block("electionOfDirectors")}
        fields={[
          { name: "passwordNote", label: "Password note", multiline: true, rows: 3 },
          {
            name: "profiles",
            label: "Director profiles",
            list: true,
            rows: 8,
            hint: "One name per line.",
          },
        ]}
      />

      <SettingsForm
        settingKey="genderDiversity"
        title="Gender diversity"
        description="On the Governance page."
        values={block("genderDiversity")}
        fields={[
          { name: "title", label: "Heading" },
          { name: "body", label: "Body", multiline: true, rows: 5 },
        ]}
      />

      <SettingsForm
        settingKey="latestAgm"
        title="Latest AGM"
        description="On the Media page."
        values={block("latestAgm")}
        fields={[
          { name: "heading", label: "Heading" },
          { name: "label", label: "Label" },
          { name: "date", label: "Date" },
          { name: "time", label: "Time" },
          {
            name: "venue",
            label: "Venue",
            list: true,
            rows: 3,
            hint: "One line of the address per line.",
          },
          {
            name: "agenda",
            label: "Agenda",
            list: true,
            rows: 6,
            hint: "One item per line.",
          },
          {
            name: "keyDates",
            label: "Key dates",
            columns: [
              { key: "label", label: "What" },
              { key: "value", label: "When" },
              { key: "note", label: "Note" },
            ],
          },
          { name: "noticeDate", label: "Notice date" },
          { name: "signedBy", label: "Signed by" },
          { name: "attendanceNote", label: "Attendance note" },
          {
            name: "source",
            label: "Source",
            hint: "Where in the filings this came from.",
          },
        ]}
      />

      <SettingsForm
        settingKey="latestBriefing"
        title="Latest corporate briefing"
        description="On the Media page."
        values={block("latestBriefing")}
        fields={[
          { name: "heading", label: "Heading" },
          { name: "label", label: "Label" },
          { name: "sessionDate", label: "Session date" },
          { name: "sessionTime", label: "Session time" },
          { name: "intimationDate", label: "Intimation date" },
          { name: "audience", label: "Audience" },
          { name: "venue", label: "Venue", list: true, rows: 3 },
          { name: "strategy", label: "Strategy points", list: true, rows: 5 },
          { name: "strategySource", label: "Strategy source" },
          {
            name: "disclosed",
            label: "Disclosed figures",
            columns: [
              { key: "label", label: "What" },
              { key: "value", label: "This year" },
              { key: "prior", label: "Prior year" },
            ],
          },
          { name: "disclosedSource", label: "Disclosures source" },
          { name: "challenges", label: "Challenges", list: true, rows: 6 },
          { name: "challengesSource", label: "Challenges source" },
          {
            name: "presentationFiled",
            label: "Presentation note",
            multiline: true,
            rows: 2,
          },
          { name: "source", label: "Source" },
        ]}
      />

      <SettingsForm
        settingKey="corporateActions"
        title="Corporate actions"
        description="On the Media page."
        values={block("corporateActions")}
        fields={[
          { name: "heading", label: "Heading" },
          { name: "intro", label: "Introduction", multiline: true, rows: 3 },
          {
            name: "items",
            label: "Actions",
            columns: [
              { key: "title", label: "Title" },
              { key: "date", label: "Date" },
              { key: "meeting", label: "Meeting" },
              { key: "body", label: "Description", wide: true },
              { key: "source", label: "Source" },
            ],
          },
        ]}
      />

      <SettingsForm
        settingKey="meetingRecord"
        title="Meeting record"
        description="The table of past general meetings on the Media page."
        values={block("meetingRecord")}
        fields={[
          { name: "heading", label: "Heading" },
          { name: "intro", label: "Introduction", multiline: true, rows: 2 },
          {
            name: "rows",
            label: "Meetings",
            columns: [
              { key: "financialYear", label: "Financial year" },
              { key: "type", label: "Type" },
              { key: "date", label: "Date" },
            ],
          },
          { name: "source", label: "Source" },
        ]}
      />

      <SettingsForm
        settingKey="shareholderServices"
        title="Shareholder services"
        description="On the Media page, including the share registrar&rsquo;s details."
        values={serviceValues}
        fields={[
          { name: "heading", label: "Heading" },
          { name: "intro", label: "Introduction", multiline: true, rows: 3 },
          {
            name: "items",
            label: "Services",
            columns: [
              { key: "title", label: "Title" },
              { key: "body", label: "Description", wide: true },
            ],
          },
          { name: "registrar.label", label: "Registrar label" },
          { name: "registrar.name", label: "Registrar name" },
          {
            name: "registrar.address",
            label: "Registrar address",
            list: true,
            rows: 3,
          },
          { name: "source", label: "Source" },
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
