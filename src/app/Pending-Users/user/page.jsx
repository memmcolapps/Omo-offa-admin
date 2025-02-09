"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import UserProfileForm from "../../components/common/userinfo";

const UserProfile = () => {
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userParam = searchParams.get("user");
    if (userParam) {
      setUser(JSON.parse(decodeURIComponent(userParam)));
    }
  }, [searchParams]);
  return <UserProfileForm user={user} showApproveReject={true} />;
};

export default UserProfile;
