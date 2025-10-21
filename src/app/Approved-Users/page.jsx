"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { redirect, useRouter } from "next/navigation";
import { Search, Download } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useGetUsers from "../hooks/useGetUsers";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { ReusableTable } from "../components/common/table";
import { downloadApprovedUsersCSV } from "../funcs/DownloadReport";

const ApprovedUsers = () => {
  const { getUsers, data, loading } = useGetUsers();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState([]);
  const limit = 20;
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUsers("APPROVED", token, currentPage, limit);
    } else {
      redirect("/");
    }
  }, [currentPage, getUsers, limit]);

  // Update users and totalPages whenever new data arrives.
  useEffect(() => {
    if (data) {
      setUsers(data.users);
      // Since API doesn't provide totalPages, we'll calculate it based on hasMore
      // If hasMore is true, there's at least one more page
      // If hasMore is false, this is the last page
      const estimatedTotalPages = data.pagination?.hasMore
        ? currentPage + 1
        : currentPage;
      setTotalPages(estimatedTotalPages);
    }
  }, [data, currentPage]);

  // Reset selection when page changes or filter changes
  useEffect(() => {
    setSelectedUsers([]);
    setSelectAll(false);
  }, [currentPage, filter]);

  // Memoize the filtered list of users based on the search filter.
  const filteredUsers = useMemo(() => {
    return users?.filter((user) =>
      user.offaNimiId.toLowerCase().includes(filter.toLowerCase())
    );
  }, [users, filter]);

  // Handlers for pagination using useCallback.
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleNextPage = useCallback(() => {
    // Allow next page if hasMore is true or if we're not on the last page
    if (data?.pagination?.hasMore || currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, handlePageChange, data?.pagination?.hasMore]);

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
        const allUserIds = filteredUsers.map((user) => user.id);
        setSelectedUsers(allUserIds);
      } else {
        setSelectedUsers([]);
      }
    },
    [filteredUsers]
  );

  // Handle CSV download
  const handleDownloadCSV = useCallback(() => {
    const selectedUsersData = filteredUsers.filter((user) =>
      selectedUsers.includes(user.id)
    );
    downloadApprovedUsersCSV(selectedUsersData);

    // Clear selection after download
    setSelectedUsers([]);
    setSelectAll(false);
  }, [filteredUsers, selectedUsers]);

  // Memoize columns definition.
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
      { key: "createdAt", header: "Date Added" },
    ],
    []
  );

  return (
    <div className="p-10 w-full">
      <ToastContainer />
      {loading ? (
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
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Search by OffaNimiID"
                  className="pl-12 pr-4 py-5 w-full text-lg rounded-full border-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-300 ease-in-out placeholder-gray-400 font-medium"
                />
              </div>
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
          </div>
          <ReusableTable
            columns={columns}
            data={filteredUsers}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={
              data.pagination?.hasMore
                ? currentPage * limit + 1
                : (currentPage - 1) * limit + (data.users?.length || 0)
            }
            handlePrevPage={handlePrevPage}
            handleNextPage={handleNextPage}
            handleRowClick={handleRowClick}
            emptyMessage="No users found."
            hasMore={data.pagination?.hasMore || false}
            hasPrevious={currentPage > 1}
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
