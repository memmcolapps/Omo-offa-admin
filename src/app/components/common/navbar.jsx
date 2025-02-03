"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "../ui/button";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const pageName = pathname.split("/").pop()?.replace("-", " ") || "Dashboard";

  return (
    <nav className="bg-[#F3FFF2] w-full shadow-sm py-10 px-5">
      <div className="flex justify-between items-center px-6">
        <p className="font-bold text-3xl capitalize">{pageName}</p>
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
