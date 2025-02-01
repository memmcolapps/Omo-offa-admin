"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardChart } from "../components/dashboard/chart";
import useGetDashboard from "@/app/hooks/useGetDashboard";

const Dashboard = () => {
  const { getDashboard, data, loading } = useGetDashboard();

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      getDashboard(token);
    }
  }, [router]);

  if (loading) {
    return <div className="text-2xl p-10">Loading...</div>;
  }

  return (
    <div className="p-10">
      <DashboardChart data={data} />;
    </div>
  );
};

export default Dashboard;
