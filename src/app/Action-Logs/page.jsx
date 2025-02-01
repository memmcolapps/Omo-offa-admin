"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
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

  // Effect to fetch logs when the currentPage changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      getLogs(token, currentPage, limit);
    }
  }, [currentPage, getLogs, router]);

  // Effect to update actions and totalPages when new data arrives
  useEffect(() => {
    if (data) {
      setActions(data.data);
      setTotalPages(data.pagination?.totalPages || 1);
    }
  }, [data]);

  // Memoize the event handler for row clicks
  const handleRowClick = useCallback((item) => {
    console.log(item);
  }, []);

  // Memoize pagination handlers
  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const handlePrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  // Memoize columns definition to avoid recreating it on every render
  const columns = useMemo(
    () => [
      { key: "action", header: "Action" },
      { key: "email", header: "Admin" },
      { key: "createdAt", header: "Timestamp" },
    ],
    []
  );

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

      {loading ? (
        <p>Loading...</p>
      ) : (
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
      )}
    </div>
  );
}
