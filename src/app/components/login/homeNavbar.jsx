"use client";
import Link from "next/link";
import Image from "next/image";

import { Button } from "../ui/button";

const Navbar = () => {
  return (
    <nav
      className={`bg-[#F3FFF2] top-0 w-[100vw] py-[2.5rem] items-center transition-all duration-500 ease-in-out`}
    >
      <div className="flex justify-between max-w-[130rem] mx-auto px-[7rem] ">
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
          className="font-[700] text-[1.2rem] bg-white text-[#003525] hover:bg-[#002E20] hover:text-white px-[2rem] py-[1.8rem] rounded-[.7rem] "
        >
          <Link href={"/"}>Contact Us</Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
