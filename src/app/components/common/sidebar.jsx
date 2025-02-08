"use client";
import React from "react";
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

const checkPermission = (user, item) => {
  if (!user) return false;

  if (user.adminType === "superadmin") return true;

  if (user.adminType === "operator") {
    if (!item.permissions) return false;

    return Object.entries(item.permissions).some(([category, requirements]) => {
      const userPermissions = user.permissions?.[category];
      return userPermissions?.view === true;
    });
  }

  return false;
};

// Separate MenuItem component
const MenuItem = ({ item, isActive }) => (
  <SidebarMenuItem className="my-2">
    <SidebarMenuButton
      asChild
      className={`w-full hover:bg-[#007250] rounded-lg transition-colors duration-200 ${
        isActive ? "bg-[#007250]" : ""
      }`}
    >
      <Link href={item.href} className="flex items-center px-4 py-10">
        {item.icon}
        <span className="ml-6 text-2xl">{item.name}</span>
      </Link>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

// Menu items with permissions required for operators
const menuItems = [
  {
    name: "Dashboard",
    href: "/Dashboard",
    icon: <LayoutDashboard size={15} />,
    userType: ["superadmin", "operator"],
    permissions: {
      user: { view: true },
    },
  },
  {
    name: "Approved Users",
    href: "/Approved-Users",
    icon: <UserCheck size={15} />,
    userType: ["superadmin", "operator"],
    permissions: {
      user: { view: true },
    },
  },
  {
    name: "Pending Users",
    href: "/Pending-Users",
    icon: <Hourglass size={15} />,
    userType: ["superadmin", "operator"],
    permissions: {
      user: { view: true },
    },
  },
  {
    name: "Rejected Users",
    href: "/Rejected-Users",
    icon: <UserX size={15} />,
    userType: ["superadmin", "operator"],
    permissions: {
      user: { view: true },
    },
  },
  {
    name: "Generate Report",
    href: "/Generate-Report",
    icon: <Clipboard size={15} />,
    userType: ["superadmin", "operator"],
    permissions: {
      reports: { view: true },
    },
  },
  {
    name: "Admin Management",
    href: "/Admin-Management",
    icon: <FolderKanban size={15} />,
    userType: ["superadmin"],
  },
  {
    name: "Audit Log",
    href: "/Action-Logs",
    icon: <Logs size={15} />,
    userType: ["superadmin", "operator"],
    permissions: {
      audit: { view: true },
    },
  },
];

export function CustomSidebar() {
  const pathname = usePathname();
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="h-screen bg-[#002E20] flex items-center justify-center">
        <div className="text-[#C8FFC4]">Loading...</div>
      </div>
    );
  }

  const authorizedMenuItems = menuItems.filter((item) =>
    checkPermission(user, item)
  );

  return (
    <Sidebar className="h-screen bg-[#002E20] text-[#C8FFC4]">
      <SidebarHeader className="h-48 flex items-center justify-center">
        <Link href="/">
          <Image
            width={100}
            height={43}
            alt="logo"
            src="/common/offanimi.svg"
            className="mx-auto"
            priority
          />
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <SidebarMenu>
          {authorizedMenuItems.map((item) => (
            <MenuItem
              key={item.name}
              item={item}
              isActive={pathname === item.href}
            />
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
