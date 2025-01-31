"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
    <div className="p-10">
      <DashboardChart data={data} />;
    </div>
  );
};

export default Dashboard;
