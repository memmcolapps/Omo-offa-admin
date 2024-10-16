"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/common/navbar";
import Sidebar from "../components/common/sidebar";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      setIsLoading(false);
      const data = {
        id: "4ce99f5a-65a1-4e7a-be90-675b4f0fcbc5",
        email: "moshood988@gmail.com",
      };
      setUserData(data);
    }
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <Navbar pageName={"Dashboard"} loggedInUser={userData} />
    </div>
  );
};

export default Dashboard;
