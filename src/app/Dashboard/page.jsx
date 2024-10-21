"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/common/navbar";
import Sidebar from "../components/common/sidebar";
import { DashboardChart } from "../components/dashboard/chart";
import useGetDashboard from "@/app/hooks/useGetDashboard";

const Dashboard = () => {
  const { getDashboard, data, loading } = useGetDashboard();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      setIsLoading(false);
      getDashboard(token);
      const userDetails = {
        id: "4ce99f5a-65a1-4e7a-be90-675b4f0fcbc5",
        email: "moshood988@gmail.com",
      };
      setUserData(userDetails);
    }
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-grow overflow-auto">
        <Navbar pageName={"Dashboard"} loggedInUser={userData} />
        <DashboardChart data={data} />
      </div>
    </div>
  );
};

export default Dashboard;
