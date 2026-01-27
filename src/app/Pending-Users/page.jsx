"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useGetUsers from "../hooks/useGetUsers";
import { Input } from "../components/ui/input";
import { ReusableTable } from "../components/common/table";

const PendingUsers = () => {
  const { getUsers, data, loading } = useGetUsers();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState([]);
  const limit = 20;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUsers("PENDING", token, currentPage, limit);
    } else {
      router.push("/");
    }
  }, [currentPage, getUsers, router, limit]);

  useEffect(() => {
    if (data) {
      setUsers(data.users);
      // Since API doesn't provide totalPages, we'll calculate it based on hasMore
      // For now, we'll use a large number or calculate based on current data
      const estimatedTotalPages = data.pagination?.hasMore
        ? currentPage + 1
        : currentPage;
      setTotalPages(estimatedTotalPages);
    }
  }, [data, currentPage]);

  const filteredData = useMemo(() => {
    return users?.filter((user) =>
      user.offaNimiId.toLowerCase().includes(filter.toLowerCase())
    );
  }, [users, filter]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [currentPage, totalPages]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  }, [currentPage]);

  const handleRowClick = useCallback(
    (user) => {
      sessionStorage.setItem(`user_${user.id}`, JSON.stringify(user));
      router.push(`/Pending-Users/user/${user.id}`);
    },
    [router]
  );

  const columns = useMemo(
    () => [
      { key: "firstName", header: "Name" },
      { key: "offaNimiId", header: "OffaNimID" },
      { key: "email", header: "Email" },
      { key: "stateOfResidence", header: "State Of Residence" },
      { key: "wardName", header: "Ward Name" },
      { key: "compoundName", header: "Compound Name" },
      { key: "phoneNumber", header: "Phone Number" },
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
    <>
      <ToastContainer />
      <div className="p-10 w-full">
        {loading ? (
          <div className="text-2xl">Loading...</div> // Show loading state
        ) : (
          <>
            <div className="w-full max-w-md py-[3rem] text-[2rem]">
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
            <ReusableTable
              columns={columns}
              data={filteredData}
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
              hasMore={data.pagination?.hasMore || false}
              hasPrevious={currentPage > 1}
            />
          </>
        )}
      </div>
    </>
  );
};

export default PendingUsers;
