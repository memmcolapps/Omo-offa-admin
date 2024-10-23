"use client";
import { useEffect } from "react";
import Sidebar from "../components/common/sidebar";
import Navbar from "../components/common/navbar";
import PendingUserTable from "../components/pendingusers/table";
import useGetUsers from "@/app/hooks/useGetUsers";

const PendingUsers = () => {
  const { getUsers, data, loading } = useGetUsers();

  useEffect(() => {
    const token = localStorage.getItem("token");
    getUsers("PENDING", token);
    console.log(data);
  });
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-grow overflow-auto">
        <Navbar pageName={"Pending Users"} />
        <PendingUserTable data={data.users ?? []} status={"PENDING"} />
      </div>
    </div>
  );
};

export default PendingUsers;
