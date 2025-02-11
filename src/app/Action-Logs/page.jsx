"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Search } from "lucide-react";
import { redirect } from "next/navigation";

import { Input } from "../components/ui/input";
import useGetLogs from "../hooks/useGetLogs";
import { ReusableTable } from "../components/common/table";

export default function AdminActionsLog() {
  const [actions, setActions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("");
  const limit = 50;
  const { getLogs, data, loading, error } = useGetLogs();

  // Handle authentication on the client side
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/"; // Using window.location instead of redirect for client-side
      } else {
        getLogs(token, currentPage, limit, filter); // Added filter parameter
      }
    };
    checkAuth();
  }, [currentPage, getLogs, filter]); // Added filter to dependencies

  useEffect(() => {
    if (data) {
      setActions(data.data || []); // Added fallback empty array
      setTotalPages(data.pagination?.totalPages || 1);
    }
  }, [data]);

  const handleRowClick = useCallback((item) => {
    if (item) {
      console.log(item);
      // Add your row click logic here
    }
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const handlePrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  // Debounce filter changes
  const handleFilterChange = useCallback((e) => {
    const value = e.target.value;
    setFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  const columns = useMemo(
    () => [
      { key: "action", header: "Action" },
      { key: "email", header: "Admin" },
      {
        key: "createdAt",
        header: "Timestamp",
      },
    ],
    []
  );

  if (error) {
    return (
      <div className="p-10 text-red-500">
        Error loading logs: {error.message}
      </div>
    );
  }

  return (
    <div className="p-10">
      <div className="max-w-md mb-8">
        {" "}
        {/* Improved responsive width */}
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <Input
            type="text"
            value={filter}
            onChange={handleFilterChange}
            placeholder="Search by action"
            className="pl-10 pr-4 py-2 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-300"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
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
