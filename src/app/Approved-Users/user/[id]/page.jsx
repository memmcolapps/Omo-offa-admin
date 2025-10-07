"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import UserProfileForm from "../../../components/common/userinfo";

const UserApprovedProfile = () => {
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
  return <UserProfileForm user={user} showApproveReject={false} />;
};

export default UserApprovedProfile;
