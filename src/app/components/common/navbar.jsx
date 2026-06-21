"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Button } from "../ui/button";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [userPageName, setUserPageName] = useState("");
  const pathSegments = useMemo(
    () => pathname.split("/").filter(Boolean),
    [pathname]
  );
  const isUserDetailPage =
    pathSegments.length >= 3 && pathSegments[pathSegments.length - 2] === "user";
  const userId = isUserDetailPage ? pathSegments[pathSegments.length - 1] : "";
  const fallbackPageName =
    pathSegments[pathSegments.length - 1]?.replace(/-/g, " ") || "Dashboard";
  const pageName = isUserDetailPage
    ? userPageName || "User Profile"
    : fallbackPageName;
  const backHref = pathname.startsWith("/Approved-Users/user")
    ? "/Approved-Users"
    : "/Pending-Users";

  useEffect(() => {
    if (!isUserDetailPage || !userId) {
      setUserPageName("");
      return;
    }

    const storedUser = sessionStorage.getItem(`user_${userId}`);
    if (!storedUser) {
      setUserPageName("User Profile");
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      const fullName = [user.firstName, user.middleName, user.lastName]
        .filter(Boolean)
        .join(" ");
      setUserPageName(fullName || user.offaNimiId || "User Profile");
    } catch {
      setUserPageName("User Profile");
    }
  }, [isUserDetailPage, userId]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(backHref);
  };

  return (
    <nav className="bg-[#F3FFF2] w-full shadow-sm py-10 px-5">
      <div className="flex justify-between items-center px-6">
        <div className="flex min-w-0 items-center gap-4">
          {isUserDetailPage && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}
          <p className="truncate font-bold text-3xl capitalize">{pageName}</p>
        </div>
        <div className="flex items-center gap-8">
          <Button
            variant="destructive"
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/");
            }}
          >
            Logout
          </Button>
          <Image
            width={87}
            height={37}
            alt="logo"
            className="w-28"
            src="/common/logo_ii.svg"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
