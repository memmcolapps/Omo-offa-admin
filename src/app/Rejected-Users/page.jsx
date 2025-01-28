"use client";
import { useEffect } from "react";
import useGetUsers from "@/app/hooks/useGetUsers";
import RejectedUserTable from "../components/rejectedusers/table";
const RejectedUsers = () => {
  const { getUsers, data, loading } = useGetUsers();

  useEffect(() => {
    const token = localStorage.getItem("token");
    getUsers("REJECTED", token);
    console.log(data);
  }, []);
  return <RejectedUserTable data={data.users ?? []} status={"REJECTED"} />;
};

export default RejectedUsers;
