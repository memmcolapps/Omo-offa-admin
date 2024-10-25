"use client";

import { Suspense, useEffect, useState } from "react";
import Sidebar from "../../components/common/sidebar";
import UserProfileForm from "../../components/common/userinfo";
import Navbar from "@/app/components/common/navbar";
import { useSearchParams } from "next/navigation";

const UserApprovedProfile = () => {
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userParam = searchParams.get("user");
    if (userParam) {
      setUser(JSON.parse(decodeURIComponent(userParam)));
    }
  }, [searchParams]);
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-grow overflow-auto">
        <Navbar pageName={"Approved Users > User Profile"} />
        <UserProfileForm user={user} showApproveReject={""} />
      </div>
    </div>
  );
};

export default UserApprovedProfile;
