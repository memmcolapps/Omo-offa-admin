"use client";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

import { SidebarProvider } from "../components/ui/sidebar";
import { CustomSidebar } from "../components/common/sidebar";
import Navbar from "../components/common/navbar";
import { UserProvider, useUser } from "../context/UserContext";
import MainContentSkeleton from "../components/common/main-content-skeleton";

// Component to handle the layout with loading state
function AppLayout({ children }) {
  const { loading } = useUser();

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden w-full">
        <CustomSidebar />
        <MainContentSkeleton />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden w-full">
      <CustomSidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto pt-4">
          <Suspense fallback={<MainContentSkeleton />}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <UserProvider>
        <AppLayout>{children}</AppLayout>
      </UserProvider>
    </SidebarProvider>
  );
}
