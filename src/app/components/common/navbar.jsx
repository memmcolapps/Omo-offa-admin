"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MaxContainer from "./maxcontainer";
import { Button } from "../ui/button";

import { usePathname } from "next/navigation";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0); // Track scroll position
  // const pathName = usePathname();

  return (
    <nav
      className={`bg-[#F3FFF2] top-0 w-[100vw] py-[2.5rem] items-center transition-all duration-500 ease-in-out ${
        scrollY > 100
      }`}
    >
      <MaxContainer>
        <div className="flex justify-between max-w-[130rem] mx-auto px-[7rem] sm:px-[2.5rem]">
          <Link href={"/"}>
            <Image
              width={87}
              height={37}
              alt="logo"
              className="w-[7rem]"
              src={"/common/logo_ii.svg"}
            />
          </Link>

          <Button
            asChild
            className="font-[700] bg-white text-[#003525] hover:bg-[#002E20] hover:text-white px-[2rem] py-[1.8rem] rounded-[.7rem] "
          >
            <Link href={"/"}>Contact Us</Link>
          </Button>
        </div>
      </MaxContainer>
    </nav>
  );
};

export default Navbar;

const NavItem = ({ navitem, isScrolled }) => {
  const pathName = usePathname();

  return (
    <Button
      asChild
      variant="link"
      className={`font-[500] ${
        pathName == navitem.link
          ? "text-[#002E20] sm:text-white font-[700]"
          : isScrolled
          ? "text-[#002E20] sm:text-[#EFFFEE]"
          : pathName !== "/"
          ? "text-[#515E59]  sm:text-[#EFFFEE]"
          : "text-white"
      }`}
    >
      <Link href={navitem.link}>{navitem.text}</Link>
    </Button>
  );
};
