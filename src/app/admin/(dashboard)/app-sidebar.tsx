"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChevronsUpDown,
  ExternalLink,
  FileText,
  Images,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Milestone,
  Settings,
  Users,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

/**
 * This shadcn build is the Base UI one, not Radix: composition is `render={...}`
 * rather than `asChild`.
 */

const CONTENT = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/documents", label: "Documents", icon: FileText },
  { href: "/admin/board", label: "Board & officers", icon: Users },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/milestones", label: "Milestones", icon: Milestone },
];

const SETUP = [
  { href: "/admin/images", label: "Images", icon: Images },
  { href: "/admin/settings", label: "Company details", icon: Settings },
];

export function AppSidebar({
  session,
}: {
  session: { name: string; email: string };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();
  const [signingOut, setSigningOut] = useState(false);

  /** Overview matches exactly, or every /admin/* page would mark it active. */
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const initials = session.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();

  const renderGroup = (label: string, items: typeof CONTENT) => (
    <SidebarGroup key={label}>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                isActive={isActive(item.href)}
                tooltip={item.label}
                render={
                  // Closing the drawer on navigation matters on mobile, where
                  // the sidebar is a sheet over the page.
                  <Link
                    href={item.href}
                    onClick={() => isMobile && setOpenMobile(false)}
                  />
                }
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/admin" />}>
              <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-md bg-brand-navy">
                <Image
                  src="/akd-logo-white.png"
                  alt=""
                  width={87}
                  height={54}
                  className="h-4 w-auto"
                />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate text-sm font-medium">
                  AKD Hospitality
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  Content dashboard
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {renderGroup("Content", CONTENT)}
        {renderGroup("Setup", SETUP)}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton size="lg">
                    <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium text-brand-navy">
                      {initials}
                    </div>
                    <div className="grid flex-1 text-left leading-tight">
                      <span className="truncate text-sm font-medium">
                        {session.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {session.email}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent
                side={isMobile ? "top" : "right"}
                align="end"
                className="w-56"
              >
                {/* Base UI's GroupLabel must sit inside a Group. */}
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <span className="block text-sm font-medium">
                      {session.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {session.email}
                    </span>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  render={<a href="/" target="_blank" rel="noreferrer" />}
                >
                  <ExternalLink />
                  View site
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={signingOut}
                  closeOnClick={false}
                  onClick={async () => {
                    setSigningOut(true);
                    await fetch("/api/admin/session", { method: "DELETE" });
                    router.replace("/admin/login");
                  }}
                >
                  <LogOut />
                  {signingOut ? "Signing out" : "Sign out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
