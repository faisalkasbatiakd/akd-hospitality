import { z } from "zod";

import * as t from "@/db/schema";
import { TAGS } from "@/lib/content";

import type { Field } from "../_components/ordered-list-manager";

/**
 * The ordered content lists that had no dashboard page.
 *
 * Each of these is a plain table of rows the site reads and renders in order.
 * They were seeded once and then unreachable: not in the dashboard, and not in
 * the code either, because editing the seed file changes nothing. The client
 * discovered this three times over, most recently trying to reword the ESG
 * policies on the About page.
 *
 * Described here as data rather than as eight near-identical pages, so adding
 * the next one is a config entry instead of another copy of the same file.
 */

const line = (max: number, label: string) =>
  z.string().trim().min(1, `${label} is required`).max(max);

export type ListKey =
  | "esgPillars"
  | "esgMetrics"
  | "esgPolicies"
  | "strategyObjectives"
  | "workstreams"
  | "companyInformation"
  | "externalLinks"
  | "businesses";

type ListConfig = {
  table: typeof t.esgPolicies | typeof t.esgPillars | typeof t.esgMetrics
    | typeof t.strategyObjectives | typeof t.workstreams
    | typeof t.companyInformation | typeof t.externalLinks | typeof t.businesses;
  /** Heading on the page. */
  title: string;
  description: string;
  addLabel: string;
  /** What an audit entry calls one row. */
  noun: string;
  /** Cache tag to clear when a row changes. */
  tag: string;
  /** Column shown as the row's heading in the list. */
  primaryField: string;
  secondaryField?: string;
  fields: Field[];
  schema: z.ZodType<Record<string, unknown>>;
};

export const LISTS: Record<ListKey, ListConfig> = {
  esgPolicies: {
    table: t.esgPolicies,
    title: "ESG policies in place",
    description: "The list under the ESG framework on the About page.",
    addLabel: "Add policy",
    noun: "policy",
    tag: TAGS.page,
    primaryField: "text",
    fields: [
      {
        name: "text",
        label: "Policy",
        placeholder: "Formal environmental policy covering waste, water, energy and recycling",
        maxLength: 400,
        multiline: true,
      },
    ],
    schema: z.object({ text: line(400, "The policy") }),
  },

  esgPillars: {
    table: t.esgPillars,
    title: "ESG pillars",
    description: "The four-pillar framework on the About page.",
    addLabel: "Add pillar",
    noun: "pillar",
    tag: TAGS.page,
    primaryField: "title",
    secondaryField: "description",
    fields: [
      { name: "title", label: "Pillar", maxLength: 200 },
      { name: "description", label: "Description", multiline: true, maxLength: 1200 },
    ],
    schema: z.object({
      title: line(200, "The pillar"),
      description: line(1200, "The description"),
    }),
  },

  esgMetrics: {
    table: t.esgMetrics,
    title: "ESG metrics",
    description:
      "The reported environmental figures on the About page. These come from the annual report - change them only when a new report is published.",
    addLabel: "Add metric",
    noun: "metric",
    tag: TAGS.page,
    primaryField: "label",
    secondaryField: "value",
    fields: [
      { name: "label", label: "Metric", maxLength: 200 },
      { name: "value", label: "Value", maxLength: 100 },
    ],
    schema: z.object({
      label: line(200, "The metric"),
      value: line(100, "The value"),
    }),
  },

  strategyObjectives: {
    table: t.strategyObjectives,
    title: "Strategy objectives",
    description: "On the About page.",
    addLabel: "Add objective",
    noun: "objective",
    tag: TAGS.page,
    primaryField: "text",
    fields: [
      { name: "text", label: "Objective", multiline: true, maxLength: 600 },
    ],
    schema: z.object({ text: line(600, "The objective") }),
  },

  workstreams: {
    table: t.workstreams,
    title: "Market analysis workstreams",
    description: "The list beside the photograph on the About page.",
    addLabel: "Add workstream",
    noun: "workstream",
    tag: TAGS.page,
    primaryField: "title",
    secondaryField: "description",
    fields: [
      { name: "title", label: "Workstream", maxLength: 200 },
      { name: "description", label: "Description", multiline: true, maxLength: 800 },
    ],
    schema: z.object({
      title: line(200, "The workstream"),
      description: line(800, "The description"),
    }),
  },

  businesses: {
    table: t.businesses,
    title: "Lines of business",
    description: "The business cards on the About page.",
    addLabel: "Add line of business",
    noun: "line of business",
    tag: TAGS.page,
    primaryField: "title",
    secondaryField: "description",
    fields: [
      { name: "title", label: "Business", maxLength: 200 },
      { name: "description", label: "Description", multiline: true, maxLength: 800 },
    ],
    schema: z.object({
      title: line(200, "The business"),
      description: line(800, "The description"),
    }),
  },

  companyInformation: {
    table: t.companyInformation,
    title: "Company information",
    description: "The statutory details table on the About page.",
    addLabel: "Add entry",
    noun: "entry",
    tag: TAGS.page,
    primaryField: "label",
    secondaryField: "values",
    fields: [
      { name: "label", label: "Label", maxLength: 200 },
      {
        name: "values",
        label: "Value",
        multiline: true,
        maxLength: 1000,
        hint: "One line per line. Several lines are shown stacked, as for an address.",
      },
    ],
    schema: z.object({
      label: line(200, "The label"),
      values: z
        .string()
        .transform((v) => v.split("\n").map((l) => l.trim()).filter(Boolean))
        .refine((l) => l.length > 0, "A value is required"),
    }),
  },

  externalLinks: {
    table: t.externalLinks,
    title: "External links",
    description: "Links out to the exchange, the registrar and similar.",
    addLabel: "Add link",
    noun: "link",
    tag: TAGS.page,
    primaryField: "label",
    secondaryField: "href",
    fields: [
      { name: "label", label: "Label", maxLength: 200 },
      { name: "href", label: "Address", placeholder: "https://…", maxLength: 500 },
    ],
    schema: z.object({
      label: line(200, "The label"),
      href: z
        .string()
        .trim()
        .min(1, "An address is required")
        .max(500)
        .refine((v) => /^https?:\/\//.test(v) || v.startsWith("/"), {
          message: "Use a full https:// address, or a path on this site starting with /",
        }),
    }),
  },
};
