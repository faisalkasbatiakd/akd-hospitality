"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { mainNav } from "@/lib/nav";
import { Button } from "@/components/ui/button";

const MOBILE_MENU_ID = "site-mobile-menu";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  /**
   * Every page opens with a full-bleed photographic hero, so the bar floats
   * over imagery and is glass-tinted. It is deliberately not sticky: it sits at
   * the top of the page and scrolls away with the content.
   */
  const overlay = true;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Close the menu on Escape. Navigation links close it in their own onClick.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header
      className="absolute inset-x-0 top-0 z-40 w-full"
    >
      <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-5 py-3.5 lg:px-10 lg:py-4">
        {/* Logo */}
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          {/*
            The supplied mark is white artwork on a transparent background, so a
            navy recolour of the same file is used on the light header and the
            white original over the dark hero. Two files rather than a CSS
            filter, so the brand colour is exact on both surfaces.
          */}
          <Image
            src={overlay ? "/akd-logo-white.png" : "/akd-logo-navy.png"}
            alt="AKD Hospitality Limited"
            width={87}
            height={54}
            priority
            className="h-9 w-auto"
          />
          <span className="hidden leading-tight sm:block">
            <span
              className={cn(
                "block text-base font-semibold transition-colors duration-300",
                overlay
                  ? "text-white group-hover:text-white/80"
                  : "text-brand-navy group-hover:text-brand-accent",
              )}
            >
              AKD Hospitality
            </span>
            <span
              className={cn(
                "block text-[11.5px] uppercase tracking-[0.18em] transition-colors duration-300",
                overlay ? "text-white/65" : "text-muted-foreground",
              )}
            >
              Limited
            </span>
          </span>
        </Link>

        {/* Floating pill nav with a sliding active indicator */}
        <nav
          aria-label="Main"
          className={cn(
            "relative mx-auto hidden items-center rounded-full p-1.5 transition-colors duration-300 lg:flex",
            overlay
              ? "border border-white/20 bg-white/12 shadow-lg backdrop-blur-md"
              : "bg-secondary",
          )}
        >
          {mainNav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                data-active={active}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.06em]",
                  // Colour and background ease between states so switching
                  // pages or hovering reads as a smooth change.
                  "transition-[background-color,color] duration-300 ease-out",
                  overlay
                    ? active
                      ? "bg-white/22 text-white"
                      : "bg-transparent text-white/80 hover:bg-white/10 hover:text-white"
                    : active
                      ? "bg-brand-navy text-white"
                      : "bg-transparent text-foreground/70 hover:bg-background hover:text-brand-navy",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0 lg:gap-3">
          <Link
            href="/contact"
            className={cn(
              "group hidden items-center gap-2.5 rounded-full py-1.5 pl-5 pr-1.5 text-sm font-semibold transition-colors duration-300 sm:inline-flex",
              overlay
                ? "border border-white/30 text-white hover:bg-white/15"
                : "border border-border text-brand-navy hover:bg-secondary",
            )}
          >
            Contact Us
            <span
              className={cn(
                "grid size-9 place-items-center rounded-full transition-transform duration-300 group-hover:translate-x-0.5",
                overlay
                  ? "bg-white text-brand-navy"
                  : "bg-brand-navy text-white",
              )}
            >
              <ArrowRight className="size-4" aria-hidden />
            </span>
          </Link>

          {/*
            Mobile menu is a plain state-driven panel rather than a dialog
            component: it needs no focus trap or overlay, and inlining it keeps
            the whole header in one file with no extra dependency.
          */}
          <Button
            variant="outline"
            size="icon-lg"
            className={cn(
              // The primary navigation control on a phone, so it gets a full
              // 44px target rather than the icon-lg default of 36px.
              "size-11 transition-colors duration-300 lg:hidden",
              overlay &&
                "border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white",
            )}
            aria-expanded={open}
            aria-controls={MOBILE_MENU_ID}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X className="size-5" aria-hidden />
            ) : (
              <Menu className="size-5" aria-hidden />
            )}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </Button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {open && (
        <nav
          id={MOBILE_MENU_ID}
          aria-label="Mobile"
          className="mx-5 animate-in fade-in slide-in-from-top-2 rounded-xl border border-border bg-background p-3 shadow-xl duration-300 lg:hidden"
        >
          <div className="flex flex-col gap-1">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                  isActive(item.href)
                    ? "bg-accent text-brand-accent"
                    : "text-foreground/80 hover:bg-accent",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-2 flex items-center justify-between rounded-md bg-brand-navy px-3 py-2.5 text-sm font-semibold text-white"
          >
            Contact Us
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </nav>
      )}
    </header>
  );
}
