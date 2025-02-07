"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { redirect, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useGetUsers from "../hooks/useGetUsers";
import { Input } from "../components/ui/input";
import { ReusableTable } from "../components/common/table";

const ApprovedUsers = () => {
  const { getUsers, data, loading } = useGetUsers();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState([]);
  const limit = 50;
  const router = useRouter();
  const [filter, setFilter] = useState("");

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
      setTotalPages(data.pagination?.totalPages || 1);
    }
  }, [data]);

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
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, handlePageChange]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  }, [currentPage, handlePageChange]);

  // Memoize row click handler.
  const handleRowClick = useCallback(
    (user) => {
      const userEncoded = encodeURIComponent(JSON.stringify(user));
      router.push(`/Approved-Users/user?user=${userEncoded}`);
    },
    [router]
  );

  // Memoize columns definition.
  const columns = useMemo(
    () => [
      { key: "firstName", header: "Name" },
      { key: "offaNimiId", header: "OffaNimID" },
      { key: "nin", header: "NIN" },
      { key: "stateOfResidence", header: "State Of Residence" },
      { key: "wardName", header: "Ward Name" },
      { key: "compoundName", header: "Compound Name" },
      { key: "phoneNumber", header: "Phone Number" },
      { key: "idPayment", header: "ID Payment" },
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
          <div className="w-1/4 py-[3rem] text-[2rem]">
            <div className="relative">
              <Search className="w-6 h-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <Input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search by OffaNimiID"
                className="pl-12 pr-4 py-5 w-full text-lg rounded-full border-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-300 ease-in-out placeholder-gray-400 font-medium"
              />
            </div>
          </div>
          <ReusableTable
            columns={columns}
            data={filteredUsers}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={data.pagination?.totalUsers}
            handlePrevPage={handlePrevPage}
            handleNextPage={handleNextPage}
            handleRowClick={handleRowClick}
            emptyMessage="No users found."
          />
        </>
      )}
    </div>
  );
};

export default ApprovedUsers;
