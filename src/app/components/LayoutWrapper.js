"use client";
import { usePathname } from "next/navigation";

import { SidebarProvider } from "../components/ui/sidebar";
import { CustomSidebar } from "../components/common/sidebar";
import Navbar from "../components/common/navbar";
import { UserProvider } from "../context/UserContext";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <UserProvider>
        <div className="flex h-screen overflow-hidden w-full">
          <CustomSidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 overflow-auto pt-4">{children}</main>
          </div>
        </div>
      </UserProvider>
    </SidebarProvider>
  );
}
