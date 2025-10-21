"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import UserProfileForm from "../../../components/common/userinfo";

const UserProfile = () => {
  const params = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (params.id) {
      const storedUser = sessionStorage.getItem(`user_${params.id}`);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [params.id]);

  if (!user) return <div>Loading...</div>;

  return <UserProfileForm user={user} showApproveReject={true} />;
};

export default UserProfile;
