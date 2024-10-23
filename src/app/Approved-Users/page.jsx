"use client";
import { useEffect } from "react";
import Sidebar from "../components/common/sidebar";
import Navbar from "../components/common/navbar";
import ApprovedUserTable from "../components/approvedusers/table";
import useGetUsers from "@/app/hooks/useGetUsers";

const ApprovedUsers = () => {
  const { getUsers, data, loading } = useGetUsers();

  useEffect(() => {
    const token = localStorage.getItem("token");
    getUsers("APPROVED", token);
    console.log(data);
  }, []);
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-grow overflow-auto">
        <Navbar pageName={"Approved Users"} />
        <ApprovedUserTable data={data.users ?? []} />
      </div>
    </div>
  );
};

export default ApprovedUsers;
