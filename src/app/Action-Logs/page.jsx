"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import useGetLogs from "../hooks/useGetLogs";
import { useRouter } from "next/navigation";
import { ReusableTable } from "../components/common/table";

export default function AdminActionsLog() {
  const [actions, setActions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("");
  const limit = 50;
  const { getLogs, data, loading } = useGetLogs();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      getLogs(token, currentPage, limit);
    }
  }, [currentPage]);

  useEffect(() => {
    if (data) {
      setActions(data.data);
      setTotalPages(data.pagination?.totalPages || 1);
    }
  }, [data]);

  const handleRowClick = (item) => {
    console.log(item);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const columns = [
    { key: "action", header: "Action" },
    { key: "email", header: "Admin" },
    { key: "createdAt", header: "Timestamp" },
  ];

  return (
    <div className="p-10">
      <div className="w-1/4 py-[3rem] text-[2rem]">
        <div className="relative text-xl">
          <Search className="w-6 h-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <Input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search by action"
            className="pl-12 pr-4 py-5 w-full text-lg rounded-full border-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-300 ease-in-out placeholder-gray-400 font-medium"
          />
        </div>
      </div>
      <ReusableTable
        columns={columns}
        data={actions}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={data?.pagination?.totalLogs}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
        handleRowClick={handleRowClick}
      />
    </div>
  );
}
