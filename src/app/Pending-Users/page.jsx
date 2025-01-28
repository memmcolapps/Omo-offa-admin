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
  }, []);
  return <PendingUserTable data={data.users ?? []} status={"PENDING"} />;
};

export default PendingUsers;
