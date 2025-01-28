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
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/app/components/ui/sidebar";

const menuItems = [
  {
    name: "Dashboard",
    href: "/Dashboard",
    icon: <LayoutDashboard size={15} />,
  },
  {
    name: "Approved User's",
    href: "/Approved-Users",
    icon: <UserCheck size={15} />,
  },
  {
    name: "Pending User's",
    href: "/Pending-Users",
    icon: <Hourglass size={15} />,
  },

  {
    name: "Rejected User's",
    href: "/Rejected-Users",
    icon: <UserX size={15} />,
  },
  {
    name: "Generate Report",
    href: "/Generate-Report",
    icon: <Clipboard size={15} />,
  },
  {
    name: "Admin Actions Log",
    href: "/Action-Logs",
    icon: <Clipboard size={15} />,
  },
];

export function CustomSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="h-screen bg-[#002E20] text-[#C8FFC4]">
      <SidebarHeader className="h-[12rem] flex items-center justify-center">
        <Link href="/">
          <Image
            width={100}
            height={43}
            alt="logo"
            src="/common/offanimi.svg"
            className="mx-auto"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-4 ">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.name} className="my-[.5rem]">
              <SidebarMenuButton
                asChild
                className={`w-full hover:bg-[#007250] rounded-lg transition-colors duration-200 ${
                  pathname === item.href ? "bg-[#007250]" : ""
                }`}
              >
                <Link href={item.href} className="flex items-center px-4 py-10">
                  {item.icon}
                  <span className="ml-[1.5rem] text-2xl">{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
