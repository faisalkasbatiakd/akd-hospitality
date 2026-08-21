"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";

/**
 * Initialises AOS (Animate On Scroll) once for the whole app.
 *
 * Elements opt in with `data-aos` attributes. Two safeguards matter here:
 *
 * - AOS's stylesheet hides every `[data-aos]` element until it animates, so a
 *   marker class is added to <html> only once AOS is actually starting. The
 *   rule in globals.css keeps the content visible whenever that class is
 *   absent, which covers both a failed script and reduced-motion visitors.
 * - Client-side navigation swaps the DOM without a reload, so AOS is re-scanned
 *   on every route change.
 */
export function AosProvider() {
  const pathname = usePathname();
  const started = useRef(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Leave the page in its plain, fully visible state.
    if (prefersReducedMotion) return;

    document.documentElement.classList.add("aos-ready");
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      offset: 80,
      // Animate once so sections do not flicker when scrolling back up.
      once: true,
    });
    started.current = true;
  }, []);

  useEffect(() => {
    if (!started.current) return;
    AOS.refreshHard();
  }, [pathname]);

  return null;
}
