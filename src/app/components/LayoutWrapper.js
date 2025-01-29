"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider } from "../components/ui/sidebar";
import { CustomSidebar } from "../components/common/sidebar";
import Navbar from "../components/common/navbar";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/";

  const loggedInUser = {
    email: "moshood988@gmail.com",
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
        <CustomSidebar />
        <div className="flex-1 flex flex-col">
          <Navbar loggedInUser={loggedInUser} />
          <main className="flex-1 overflow-auto pt-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
