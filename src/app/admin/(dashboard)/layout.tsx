import type { Metadata } from "next";

import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { requireSession } from "@/lib/auth";

import { AppSidebar } from "./app-sidebar";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · AKD Dashboard" },
  robots: { index: false, follow: false },
};

/**
 * Chrome for the signed-in dashboard.
 *
 * The login page deliberately sits outside this route group: when it shared
 * the layout, the layout resolved with no session, and a client-side
 * navigation after signing in reused that instance - so the sidebar never
 * appeared until a full reload.
 *
 * shadcn's Sidebar handles the responsive behaviour: a rail that collapses to
 * icons on desktop, and a sheet triggered by SidebarTrigger below the md
 * breakpoint.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();

  return (
    <TooltipProvider delay={300}>
      <SidebarProvider>
        <AppSidebar session={session} />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-1 h-4" />
            <span className="text-sm font-medium text-brand-navy">
              Content dashboard
            </span>
          </header>
          <div className="flex-1 p-4 md:p-6 lg:p-8">{children}</div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster position="bottom-right" />
    </TooltipProvider>
  );
}
