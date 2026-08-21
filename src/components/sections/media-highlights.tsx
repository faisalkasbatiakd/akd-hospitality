import Image from "next/image";
import {
  BadgeCheck,
  Banknote,
  CalendarClock,
  FileSignature,
  Gavel,
  IdCard,
  Landmark,
  Mail,
  MapPin,
  Presentation,
  ScrollText,
  Target,
  TriangleAlert,
  Users,
} from "lucide-react";

import { iconTint } from "@/lib/icon-tints";
import { cn } from "@/lib/utils";
import { docUrl } from "@/lib/site";
import { company, mediaSectionMedia } from "@/data/company";
import {
  corporateActions,
  latestAgm,
  latestBriefing,
  meetingRecord,
  shareholderServices,
} from "@/data/media-notices";
import { SectionHeading } from "@/components/shared/section-heading";

const serviceIcons = [
  IdCard,
  Banknote,
  ScrollText,
  Landmark,
  Users,
  Mail,
] as const;

/** A small labelled fact, used inside the two meeting cards. */
function Fact({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="border-t border-border pt-3.5 first:border-0 first:pt-0">
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1.5 text-sm font-medium text-brand-navy">{value}</dd>
      {note && <p className="mt-1 text-xs text-foreground/60">{note}</p>}
    </div>
  );
}

/**
 * The real content of the Media page: the last AGM, the last corporate briefing
 * session, the 2021 resolutions that made this a hospitality company, the
 * record of general meetings and what a shareholder actually has to do.
 *
 * Every block cites the filing it is drawn from, in the same way the Investors
 * page does, so a reader can check any statement against the PDF below it.
 */
export function MediaHighlights() {
  return (
    <>
      {/* Latest AGM + latest corporate briefing */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHeading
            eyebrow="Latest disclosures"
            title="The most recent meeting and briefing"
            description="Details below are taken from the notices and filings published by the Company, each of which can be downloaded in full further down this page."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
            {/* AGM */}
            <article
              className="group flex flex-col overflow-hidden rounded-2xl border border-border card-hover"
              data-aos="fade-up"
            >
              <div className="relative h-44 w-full overflow-hidden sm:h-52">
                <Image
                  src={mediaSectionMedia.agm.image}
                  alt={mediaSectionMedia.agm.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <span className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy">
                  {latestAgm.label}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6 lg:p-7">
                <div className="flex items-start gap-4">
                  <span
                    className={cn(
                      "grid size-10 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105",
                      iconTint(0),
                    )}
                  >
                    <CalendarClock className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-lg font-medium text-brand-navy">
                      {latestAgm.heading}
                    </h3>
                    <p className="mt-1 text-sm text-foreground/75">
                      {latestAgm.time} · {latestAgm.date}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-start gap-2.5 text-sm text-foreground/75">
                  <MapPin
                    className="mt-0.5 size-4 shrink-0 text-brand-accent"
                    aria-hidden
                  />
                  <span>
                    {latestAgm.venue.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                    <span className="mt-1 block text-xs text-foreground/60">
                      {latestAgm.attendanceNote}
                    </span>
                  </span>
                </div>

                <h4 className="mt-7 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Ordinary business
                </h4>
                <ol className="mt-3 space-y-3">
                  {latestAgm.agenda.map((item, index) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground/75">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-accent/10 text-xs font-semibold text-brand-accent">
                        {index + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>

                <dl className="mt-7 space-y-3.5">
                  {latestAgm.keyDates.map((d) => (
                    <Fact key={d.label} label={d.label} value={d.value} note={d.note} />
                  ))}
                </dl>

                <div className="mt-auto pt-7">
                  <p className="text-xs text-foreground/60">
                    {latestAgm.noticeDate} · {latestAgm.signedBy}
                  </p>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {latestAgm.source}
                  </p>
                  <a
                    href={docUrl("AKD_HL_AGM_Notice_2025.pdf")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-brand-navy transition-colors duration-300 hover:border-brand-accent/50 hover:bg-brand-accent/[0.04]"
                  >
                    <FileSignature className="size-4 text-brand-accent" aria-hidden />
                    Read the full notice
                  </a>
                </div>
              </div>
            </article>

            {/* Corporate briefing */}
            <article
              className="group flex flex-col overflow-hidden rounded-2xl border border-border card-hover"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="relative h-44 w-full overflow-hidden sm:h-52">
                <Image
                  src={mediaSectionMedia.briefing.image}
                  alt={mediaSectionMedia.briefing.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <span className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy">
                  {latestBriefing.label}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6 lg:p-7">
                <div className="flex items-start gap-4">
                  <span
                    className={cn(
                      "grid size-10 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105",
                      iconTint(2),
                    )}
                  >
                    <Presentation className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-lg font-medium text-brand-navy">
                      {latestBriefing.heading}
                    </h3>
                    <p className="mt-1 text-sm text-foreground/75">
                      {latestBriefing.sessionTime} · {latestBriefing.sessionDate}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-start gap-2.5 text-sm text-foreground/75">
                  <MapPin
                    className="mt-0.5 size-4 shrink-0 text-brand-accent"
                    aria-hidden
                  />
                  <span>
                    {latestBriefing.venue.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                    <span className="mt-1 block text-xs text-foreground/60">
                      {latestBriefing.audience}
                    </span>
                  </span>
                </div>

                <h4 className="mt-7 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Results presented
                </h4>
                <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                  {latestBriefing.disclosed.map((d) => (
                    <div key={d.label} className="rounded-xl border border-border p-4">
                      <dt className="text-xs leading-snug text-muted-foreground">
                        {d.label}
                      </dt>
                      <dd className="mt-1.5 text-base font-medium tabular-nums text-brand-navy">
                        {d.value}
                      </dd>
                      <p className="mt-1 text-xs text-foreground/55">{d.prior}</p>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-xs text-muted-foreground">
                  {latestBriefing.disclosedSource}
                </p>

                <div className="mt-7 grid gap-6 sm:grid-cols-2">
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      <Target className="size-3.5 text-brand-accent" aria-hidden />
                      Strategy
                    </h4>
                    <ul className="mt-3 space-y-2">
                      {latestBriefing.strategy.map((s) => (
                        <li
                          key={s}
                          className="flex gap-2 text-sm leading-snug text-foreground/75"
                        >
                          <BadgeCheck
                            className="mt-0.5 size-3.5 shrink-0 text-brand-accent"
                            aria-hidden
                          />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      <TriangleAlert className="size-3.5 text-amber-600" aria-hidden />
                      Challenges named
                    </h4>
                    <ul className="mt-3 space-y-2">
                      {latestBriefing.challenges.map((c) => (
                        <li
                          key={c}
                          className="flex gap-2 text-sm leading-snug text-foreground/75"
                        >
                          <span
                            className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500"
                            aria-hidden
                          />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-auto pt-7">
                  <p className="text-xs text-foreground/60">
                    {latestBriefing.presentationFiled}
                  </p>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {latestBriefing.source}
                  </p>
                  <a
                    href={docUrl("Corporate_Briefing_Session_21_11_2025.pdf")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-brand-navy transition-colors duration-300 hover:border-brand-accent/50 hover:bg-brand-accent/[0.04]"
                  >
                    <Presentation className="size-4 text-brand-accent" aria-hidden />
                    Read the presentation
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Corporate actions 2021 */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHeading
            eyebrow="Corporate actions"
            title={corporateActions.heading}
            description={corporateActions.intro}
          />

          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {corporateActions.items.map((item, index) => (
              <li
                key={item.title}
                data-aos="fade-up"
                data-aos-delay={index * 80}
                className="group flex flex-col rounded-2xl border border-border p-6 card-hover lg:p-7"
              >
                <span
                  className={cn(
                    "grid size-10 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105",
                    iconTint(index + 1),
                  )}
                >
                  <Gavel className="size-5" aria-hidden />
                </span>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-accent">
                  {item.date}
                </p>
                <h3 className="mt-2 text-base font-medium leading-snug text-brand-navy">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/75">
                  {item.body}
                </p>
                <p className="mt-auto pt-5 text-xs text-muted-foreground">
                  {item.meeting} · {item.source}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Meeting record + shareholder services */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
            {/* Record of meetings. min-w-0 stops the table's intrinsic minimum
                width leaking out of its scroll container into the grid track. */}
            <div className="min-w-0">
              <SectionHeading
                eyebrow="Meeting history"
                title={meetingRecord.heading}
                description={meetingRecord.intro}
              />

              <div
                className="mt-8 overflow-hidden rounded-2xl border border-border"
                data-aos="fade-up"
              >
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[22rem] border-collapse text-sm">
                    <thead>
                      <tr className="bg-brand-navy text-white">
                        <th scope="col" className="px-5 py-3 text-left font-medium">
                          Date
                        </th>
                        <th scope="col" className="px-5 py-3 text-left font-medium">
                          Meeting
                        </th>
                        <th scope="col" className="px-5 py-3 text-left font-medium">
                          Relates to
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {meetingRecord.rows.map((row) => (
                        <tr
                          key={`${row.date}-${row.financialYear}`}
                          className="border-t border-border"
                        >
                          <td className="whitespace-nowrap px-5 py-3 text-brand-navy">
                            {row.date}
                          </td>
                          <td className="px-5 py-3 text-foreground/75">
                            {row.type === "Annual General Meeting" ? "AGM" : "EOGM"}
                          </td>
                          <td className="px-5 py-3 text-foreground/75">
                            {row.financialYear}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                {meetingRecord.source}
              </p>
            </div>

            {/* Shareholder services */}
            <div className="min-w-0">
              <SectionHeading
                eyebrow="For shareholders"
                title={shareholderServices.heading}
                description={shareholderServices.intro}
              />

              <div
                className="mt-8 rounded-2xl bg-brand-navy p-6 text-white lg:p-7"
                data-aos="fade-up"
              >
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em]">
                  {shareholderServices.registrar.label}
                </h3>
                <p className="mt-4 text-base font-medium">
                  {shareholderServices.registrar.name}
                </p>
                <address className="mt-2 text-sm not-italic leading-relaxed text-white/70">
                  {shareholderServices.registrar.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                <a
                  href={`mailto:${company.contact.investorEmail}`}
                  className="-mb-2 mt-3 inline-flex items-center gap-2 py-2 text-sm [overflow-wrap:anywhere] text-brand-sky transition-colors duration-300 hover:text-white"
                >
                  <Mail className="size-4" aria-hidden />
                  {company.contact.investorEmail}
                </a>
              </div>

              <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                {shareholderServices.items.map((item, index) => {
                  const Icon = serviceIcons[index % serviceIcons.length];
                  return (
                    <div
                      key={item.title}
                      data-aos="fade-up"
                      data-aos-delay={index * 60}
                      className="group rounded-2xl border border-border p-5 card-hover"
                    >
                      <span
                        className={cn(
                          "grid size-9 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105",
                          iconTint(index),
                        )}
                      >
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <dt className="mt-4 text-sm font-medium text-brand-navy">
                        {item.title}
                      </dt>
                      <dd className="mt-2 text-sm leading-relaxed [overflow-wrap:anywhere] text-foreground/70">
                        {item.body}
                      </dd>
                    </div>
                  );
                })}
              </dl>

              <p className="mt-5 text-xs text-muted-foreground">
                {shareholderServices.source}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
