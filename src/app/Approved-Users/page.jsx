"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { redirect, useRouter } from "next/navigation";
import { Search, Download, Printer } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useGetUsers from "../hooks/useGetUsers";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { ReusableTable } from "../components/common/table";
import {
  downloadApprovedUsersCSV,
  downloadForBankExcel,
} from "../funcs/DownloadReport";
import { printAccountForms } from "../funcs/PrintAccountForm";

const ApprovedUsers = () => {
  const { getUsers, data, loading } = useGetUsers();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState([]);
  const limit = 20;
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const isInitialLoading = loading && !Array.isArray(data?.users);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUsers("APPROVED", token, currentPage, limit, debouncedFilter);
    } else {
      redirect("/");
    }
  }, [currentPage, debouncedFilter, getUsers, limit]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedFilter(filter.trim());
    }, 300);
    return () => clearTimeout(timeout);
  }, [filter]);

  useEffect(() => {
    if (data) {
      setUsers(data.users || []);
      setTotalPages(data.pagination?.totalPages || 1);
    }
  }, [data]);

  // Reset selection when page changes or filter changes
  useEffect(() => {
    setSelectedUsers([]);
    setSelectAll(false);
  }, [currentPage, filter]);

  // Handlers for pagination using useCallback.
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleNextPage = useCallback(() => {
    // Allow next page if hasMore is true or if we're not on the last page
    if (data?.pagination?.hasNextPage || currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, handlePageChange, data?.pagination?.hasNextPage]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  }, [currentPage, handlePageChange]);

  // Memoize row click handler.
  const handleRowClick = useCallback(
    (user) => {
      sessionStorage.setItem(`user_${user.id}`, JSON.stringify(user));
      router.push(`/Approved-Users/user/${user.id}`);
    },
    [router]
  );

  // Handle individual user selection
  const handleUserSelection = useCallback((userId, checked) => {
    setSelectedUsers((prev) => {
      if (checked) {
        return [...prev, userId];
      } else {
        return prev.filter((id) => id !== userId);
      }
    });
  }, []);

  // Handle select all functionality
  const handleSelectAll = useCallback(
    (checked) => {
      setSelectAll(checked);
      if (checked) {
        const allUserIds = users.map((user) => user.id);
        setSelectedUsers(allUserIds);
      } else {
        setSelectedUsers([]);
      }
    },
    [users]
  );

  // Handle Excel download
  const handleDownloadExcel = useCallback(() => {
    const selectedUsersData = users.filter((user) =>
      selectedUsers.includes(user.id)
    );
    downloadForBankExcel(selectedUsersData);

    setSelectedUsers([]);
    setSelectAll(false);
  }, [users, selectedUsers]);

  // Handle print forms
  const handlePrintForms = useCallback(() => {
    const selectedUsersData = users.filter((user) =>
      selectedUsers.includes(user.id)
    );
    printAccountForms(selectedUsersData);
  }, [users, selectedUsers]);

  // Handle CSV download
  const handleDownloadCSV = useCallback(() => {
    const selectedUsersData = users.filter((user) =>
      selectedUsers.includes(user.id)
    );
    downloadApprovedUsersCSV(selectedUsersData);

    setSelectedUsers([]);
    setSelectAll(false);
  }, [users, selectedUsers]);

  const columns = useMemo(
    () => [
      {
        key: "fullName",
        header: "Full Name",
        render: (user) => (
          <div
            className="truncate"
            title={`${user.firstName} ${user.lastName}`}
          >
            {user.firstName} {user.lastName}
          </div>
        ),
      },
      { key: "offaNimiId", header: "OffaNimID" },
      { key: "stateOfResidence", header: "State" },
      { key: "wardName", header: "Ward" },
      { key: "compoundName", header: "Compound" },
      { key: "phoneNumber", header: "Phone" },
      { key: "occupation", header: "Occupation" },
      { key: "bankName", header: "Bank" },
      {
        key: "idPayment",
        header: "ID Payment",
        render: (user) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              user.idPayment
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {user.idPayment ? "Paid" : "Pending"}
          </span>
        ),
      },
      {
        key: "fingerprintCaptured",
        header: "Fingerprint",
        render: (user) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              user.fingerprintCaptured
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {user.fingerprintCaptured ? "Captured" : "Not Captured"}
          </span>
        ),
      },
      { key: "createdAt", header: "Date Added" },
    ],
    []
  );

  return (
    <div className="p-10 w-full">
      <ToastContainer />
      {isInitialLoading ? (
        <div className="text-2xl">Loading...</div> // Loading state
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-4 py-[3rem]">
            <div className="w-full max-w-md">
              <div className="relative">
                <Search className="w-6 h-6 text-black absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input
                  type="text"
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by OffaNimiID"
                  className="pl-12 pr-4 py-5 w-full text-lg rounded-full border-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-300 ease-in-out placeholder-gray-400 font-medium"
                />
              </div>
              {loading && (
                <p className="mt-2 text-sm text-gray-500" role="status">
                  Searching…
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleDownloadCSV}
                disabled={selectedUsers.length === 0}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                title={
                  selectedUsers.length === 0
                    ? "Select users to download"
                    : `Download ${selectedUsers.length} selected users`
                }
              >
                <Download className="w-4 h-4" />
                {selectedUsers.length === 0
                  ? "Download CSV"
                  : `Download CSV (${selectedUsers.length} selected)`}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleDownloadExcel}
                disabled={selectedUsers.length === 0}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                title={
                  selectedUsers.length === 0
                    ? "Select users to download"
                    : `Download ${selectedUsers.length} selected users`
                }
              >
                <Download className="w-4 h-4" />
                {selectedUsers.length === 0
                  ? "Download Excel"
                  : `Download Excel (${selectedUsers.length} selected)`}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handlePrintForms}
                disabled={selectedUsers.length === 0}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                title={
                  selectedUsers.length === 0
                    ? "Select users to print"
                    : `Print forms for ${selectedUsers.length} selected users`
                }
              >
                <Printer className="w-4 h-4" />
                {selectedUsers.length === 0
                  ? "Print Forms"
                  : `Print Forms (${selectedUsers.length} selected)`}
              </Button>
            </div>
          </div>
          <ReusableTable
            columns={columns}
            data={users}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={data.pagination?.totalItems || 0}
            handlePrevPage={handlePrevPage}
            handleNextPage={handleNextPage}
            handleRowClick={handleRowClick}
            emptyMessage="No users found."
            hasMore={data.pagination?.hasNextPage || false}
            hasPrevious={data.pagination?.hasPreviousPage || false}
            itemsPerPage={limit}
            enableSelection={true}
            selectedItems={selectedUsers}
            onSelectionChange={handleUserSelection}
            selectAll={selectAll}
            onSelectAll={handleSelectAll}
          />
        </>
      )}
    </div>
  );
};

export default ApprovedUsers;
