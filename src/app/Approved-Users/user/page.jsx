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
  return <UserProfileForm user={user} showApproveReject={""} />;
};

export default UserApprovedProfile;
