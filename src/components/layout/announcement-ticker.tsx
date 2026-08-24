"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";


const ROTATE_MS = 6000;

export type Announcement = { title: string; href: string };

/**
 * Notices come from the server as props. The rotation is client state, so the
 * component stays a client one - but the content is editable in the dashboard
 * rather than compiled in.
 */
export function AnnouncementTicker({
  announcements,
}: {
  announcements: Announcement[];
}) {
  const [index, setIndex] = useState(0);
  const total = announcements.length;

  const go = useCallback(
    (direction: 1 | -1) => setIndex((i) => (i + direction + total) % total),
    [total],
  );

  useEffect(() => {
    if (total < 2) return;
    const timer = window.setInterval(() => go(1), ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [go, total]);

  /**
   * An editor can now remove every notice, so the bar has to be able to
   * disappear rather than render an undefined item.
   */
  if (total === 0) return null;

  const current = announcements[index % total];

  return (
    <div className="relative z-50 bg-brand-navy text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-2.5 sm:px-6">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous announcement"
          className="grid size-9 shrink-0 place-items-center rounded-full transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>

        <p
          aria-live="polite"
          className="line-clamp-2 flex-1 text-center text-xs font-medium uppercase leading-snug tracking-[0.08em] sm:line-clamp-none sm:truncate"
        >
          {current.title}{" "}
          <Link
            href={current.href}
            className="ml-1 font-semibold underline underline-offset-2 transition-opacity hover:opacity-80"
          >
            Read More
          </Link>
        </p>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next announcement"
          className="grid size-9 shrink-0 place-items-center rounded-full transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
