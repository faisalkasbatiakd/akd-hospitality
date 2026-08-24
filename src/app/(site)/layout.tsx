import { AnnouncementTicker } from "@/components/layout/announcement-ticker";
import { AosProvider } from "@/components/layout/aos-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getAnnouncements } from "@/lib/content";

/**
 * Chrome for the public site.
 *
 * Split out of the root layout so the admin dashboard does not inherit it: the
 * ticker, the overlay header and the footer belong to the website, not to the
 * tool used to edit it. Route groups do not appear in URLs, so /about is still
 * /about.
 */
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const announcements = await getAnnouncements();

  return (
    <div className="flex min-h-full flex-col">
      <AosProvider />
      <AnnouncementTicker announcements={announcements} />
      {/* Relative wrapper so the header can overlay the home page hero. */}
      <div className="relative flex flex-1 flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
      </div>
      <SiteFooter />
    </div>
  );
}
