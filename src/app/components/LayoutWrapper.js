"use client";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

import { SidebarProvider } from "../components/ui/sidebar";
import { CustomSidebar } from "../components/common/sidebar";
import Navbar from "../components/common/navbar";
import { UserProvider, useUser } from "../context/UserContext";
import {
  canAccessRoute,
  getFirstAccessibleRoute,
} from "../utils/adminAccess";
import MainContentSkeleton from "../components/common/main-content-skeleton";

function AppLayout({ children }) {
  const { user, status } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const canAccess = status === "authenticated" && canAccessRoute(user, pathname);

  useEffect(() => {
    if (status === "authenticated" && !canAccess) {
      router.replace(getFirstAccessibleRoute(user));
    }
  }, [canAccess, router, status, user]);

  if (!canAccess) {
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
