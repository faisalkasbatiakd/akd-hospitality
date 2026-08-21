import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, Printer } from "lucide-react";

import { company } from "@/data/company";
import { legalNav, mainNav } from "@/lib/nav";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-brand-navy-dark text-white/75">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              {/* White original of the supplied mark, for the dark footer. */}
              <Image
                src="/akd-logo-white.png"
                alt="AKD Hospitality Limited"
                width={87}
                height={54}
                className="h-9 w-auto"
              />
              <span className="leading-tight">
                <span className="block text-base font-semibold text-white">
                  {company.name}
                </span>
                <span className="block text-xs uppercase tracking-[0.18em] text-white/60">
                  {company.formerName}
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-md text-sm leading-relaxed">
              Incorporated in {company.incorporated} and listed on the{" "}
              {company.exchange} under the symbol{" "}
              <span className="font-semibold text-white">{company.symbol}</span>.
              Engaged in tourism, hospitality, motels and destination management
              services in Pakistan.
            </p>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs">
              {company.externalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-block py-1 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
              Head Office
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-accent" aria-hidden />
                <span>
                  {company.contact.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-brand-accent" aria-hidden />
                <a
                  href={`tel:${company.contact.phone.replace(/[^\d+]/g, "")}`}
                  className="transition-colors hover:text-white"
                >
                  {company.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Printer className="size-4 shrink-0 text-brand-accent" aria-hidden />
                <span>{company.contact.fax}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-brand-accent" aria-hidden />
                <a
                  href={`mailto:${company.contact.email}`}
                  className="break-all transition-colors hover:text-white"
                >
                  {company.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            Copyright &copy; {year} {company.name}. All rights reserved.
          </p>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2" aria-label="Legal">
            {legalNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-block py-1 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
