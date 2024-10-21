"use client";
import { useEffect } from "react";
import Sidebar from "../components/common/sidebar";
import Navbar from "../components/common/navbar";
import PendingUserTable from "../components/pendingusers/table";
import useGetUsers from "@/app/hooks/useGetUsers";
const RejectedUsers = () => {
  const { getUsers, data, loading } = useGetUsers();

  useEffect(() => {
    const token = localStorage.getItem("token");
    getUsers("REJECTED", token);
    console.log(data);
  }, []);
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-grow overflow-auto">
        <Navbar pageName={"Rejected Users"} />
        <PendingUserTable data={data.users ?? []} status={"REJECTED"} />
      </div>
    </div>
  );
};

export default RejectedUsers;
