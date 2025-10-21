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
  const limit = 20;
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
      // Use the actual totalPages from API response
      setTotalPages(data.pagination?.totalPages || 1);
    }
  }, [data]);

  const handleRowClick = useCallback((item) => {
    if (item) {
      // Add your row click logic here
    }
  }, []);

  const handleNextPage = useCallback(() => {
    // Use hasNextPage from API response
    if (data?.pagination?.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [data?.pagination?.hasNextPage]);

  const handlePrevPage = useCallback(() => {
    // Use hasPreviousPage from API response
    if (data?.pagination?.hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [data?.pagination?.hasPreviousPage]);

  // Debounce filter changes
  const handleFilterChange = useCallback((e) => {
    const value = e.target.value;
    setFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  const columns = useMemo(
    () => [
      {
        key: "action",
        header: "Action",
        render: (item) => (
          <div className="truncate font-medium" title={item.action}>
            {item.action}
          </div>
        ),
      },
      {
        key: "email",
        header: "Admin",
        render: (item) => (
          <div className="truncate" title={item.email}>
            {item.email}
          </div>
        ),
      },
      {
        key: "createdAt",
        header: "Timestamp",
        render: (item) => (
          <div className="truncate text-gray-600" title={item.createdAt}>
            {new Date(item.createdAt).toLocaleString()}
          </div>
        ),
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
          totalItems={data?.pagination?.totalLogs || 0}
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage}
          handleRowClick={handleRowClick}
          hasMore={data?.pagination?.hasNextPage || false}
          hasPrevious={data?.pagination?.hasPreviousPage || false}
        />
      )}
    </div>
  );
}
