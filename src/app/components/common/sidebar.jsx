"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Hourglass,
  UserCheck,
  UserX,
  Clipboard,
  Logs,
  FolderKanban,
  ChartLine,
  Package,
} from "lucide-react";

import { useUser } from "../../context/UserContext";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../../components/ui/sidebar";
import SidebarSkeleton from "./sidebar-skeleton";

const MENU_ITEMS = [
  {
    name: "Dashboard",
    href: "/Dashboard",
    icon: <LayoutDashboard size={24} className="shrink-0" />, 
    userType: ["superadmin", "operator"],
    permissions: { user: { view: true } },
  },
  {
    name: "Compounds",
    href: "/Compounds",
    icon: <Package size={24} className="shrink-0" />, 
    userType: ["superadmin", "operator"],
    // permissions: { compounds: { view: false } },
  },
  {
    name: "Approved Users",
    href: "/Approved-Users",
    icon: <UserCheck size={24} className="shrink-0" />,
    userType: ["superadmin", "operator"],
    permissions: { user: { view: true } },
  },
  {
    name: "Pending Users",
    href: "/Pending-Users",
    icon: <Hourglass size={24} className="shrink-0" />,
    userType: ["superadmin", "operator"],
    permissions: { user: { view: true } },
  },
  {
    name: "Rejected Users",
    href: "/Rejected-Users",
    icon: <UserX size={24} className="shrink-0" />,
    userType: ["superadmin", "operator"],
    permissions: { user: { view: true } },
  },
  {
    name: "Generate Report",
    href: "/Generate-Report",
    icon: <Clipboard size={24} className="shrink-0" />,
    userType: ["superadmin", "operator"],
    permissions: { reports: { view: true } },
  },
  {
    name: "Report Summary",
    href: "/Report-Summary",
    icon: <ChartLine size={24} className="shrink-0" />,
    userType: ["superadmin", "operator"],
    permissions: { reports: { view: true } },
  },
  {
    name: "Admin Management",
    href: "/Admin-Management",
    icon: <FolderKanban size={24} className="shrink-0" />,
    userType: ["superadmin"],
  },
  {
    name: "Audit Log",
    href: "/Action-Logs",
    icon: <Logs size={24} className="shrink-0" />,
    userType: ["superadmin", "operator"],
    permissions: { audit: { view: true } },
  },
];

const MenuItem = React.memo(({ item, isActive }) => (
  <SidebarMenuItem className="my-6">
    <SidebarMenuButton
      asChild
      className={`group w-full hover:bg-[#007250] rounded-lg transition-all duration-200 ${
        isActive ? "bg-[#007250]" : ""
      }`}
    >
      <Link
        href={item.href}
        className="flex items-center px-4 py-3 gap-6"
        aria-current={isActive ? "page" : undefined}
      >
        {item.icon}
        <span className="text-2xl font-medium group-hover:translate-x-1 transition-transform">
          {item.name}
        </span>
      </Link>
    </SidebarMenuButton>
  </SidebarMenuItem>
));

MenuItem.displayName = "MenuItem";

const checkPermission = (user, item) => {
  if (!user) return false;
  if (user.adminType === "superadmin") return true;
  if (user.adminType !== "operator") return false;

  return item.permissions
    ? Object.entries(item.permissions).some(
        ([category, requirements]) =>
          user.permissions?.[category]?.view === true
      )
    : false;
};

export function CustomSidebar() {
  const pathname = usePathname();
  const { user, loading } = useUser();

  const authorizedMenuItems = useMemo(
    () => MENU_ITEMS.filter((item) => checkPermission(user, item)),
    [user]
  );

  if (loading) {
    return <SidebarSkeleton />;
  }

  return (
    <Sidebar className="h-screen bg-[#002E20] text-[#C8FFC4]">
      <SidebarHeader className="h-48 flex items-center justify-center p-4">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Image
            width={100}
            height={43}
            alt="OffaNimi Logo"
            src="/common/offanimi.svg"
            className="mx-auto"
            priority
            quality={90}
          />
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <SidebarMenu>
          {authorizedMenuItems.map((item) => (
            <MenuItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
            />
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
