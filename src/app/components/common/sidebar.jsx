import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Hourglass,
  UserCheck,
  UserX,
  Clipboard,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    href: "/Dashboard",
    icon: <LayoutDashboard size={15} />,
  },
  {
    name: "Pending User’s",
    href: "/Pending-Users",
    icon: <Hourglass size={15} />,
  },
  {
    name: "Approved User’s",
    href: "/Approved-Users",
    icon: <UserCheck size={15} />,
  },
  {
    name: "Rejected User’s",
    href: "/Rejected-Users",
    icon: <UserX size={15} />,
  },
  {
    name: "Generate Report",
    href: "/Generate-Report",
    icon: <Clipboard size={15} />,
  },
];

const Sidebar = () => {
  return (
    <aside className="w-1/5 h-screen bg-[#002E20] text-[#C8FFC4]">
      <nav className="mt-5">
        <Link href={"/"}>
          <Image
            width={100}
            height={43}
            alt="logo"
            className="my-[4rem] mx-auto"
            src={"/common/offanimi.svg"}
          />
        </Link>
        <ul className="mt-[5rem]">
          {menuItems.map((item) => (
            <li key={item.name} className="my-[2.5rem] mx-auto w-3/4">
              <Link
                href={item.href}
                className="flex items-center px-4 py-2 hover:bg-[#007250] rounded-lg transition-colors duration-200"
              >
                {item.icon}
                <span className="p_ii ml-[1.5rem] ">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
