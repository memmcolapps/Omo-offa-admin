"use client";

import Link from "next/link";
import Image from "next/image";
import MaxContainer from "./maxcontainer";
import { Button } from "../ui/button";

const Navbar = ({ pageName, loggedInUser }) => {
  return (
    <nav className="bg-[#F3FFF2] top-0 w-full py-[2.5rem] items-center transition-all duration-500 ease-in-out">
      <MaxContainer>
        <div className="flex justify-between max-w-[130rem] mx-auto px-[2rem] lg:px-[7rem]">
          <p className="font-[700] text-xl">{pageName}</p>

          <div className="flex items-center">
            <p className="text-[1.2rem] mx-5">
              {loggedInUser?.email ?? "Admin"}
            </p>

            <Image
              width={87}
              height={37}
              alt="logo"
              className="w-[7rem]"
              src={"/common/logo_ii.svg"}
            />
          </div>
        </div>
      </MaxContainer>
    </nav>
  );
};

export default Navbar;
