"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useGetUsers from "@/app/hooks/useGetUsers";
import { Input } from "@/app/components/ui/input";
import { Search } from "lucide-react";
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
      router.push("/");
    }
  }, [currentPage]);

  useEffect(() => {
    if (data) {
      setUsers(data.users);
      setTotalPages(data.pagination?.totalPages || 1);
    }
  }, [data]);

  const filteredUsers = users?.filter((user) =>
    user.offaNimiId.toLowerCase().includes(filter.toLowerCase())
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleRowClick = (user) => {
    const userEncoded = encodeURIComponent(JSON.stringify(user));
    router.push(`/Approved-Users/user?user=${userEncoded}`);
  };

  const columns = [
    { key: "firstName", header: "Name" },
    { key: "offaNimiId", header: "OffaNimID" },
    { key: "nin", header: "NIN" },
    { key: "stateOfResidence", header: "State Of Residence" },
    { key: "wardName", header: "Ward Name" },
    { key: "compoundName", header: "Compound Name" },
    { key: "phoneNumber", header: "Phone Number" },
    { key: "idPayment", header: "ID Payment" },
    { key: "createdAt", header: "Date Added" },
  ];

  return (
    <div className="p-10 w-full">
      {loading ? (
        <div className="text-2xl">Loading...</div> // Show loading state
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
          />
        </>
      )}
    </div>
  );
};

export default ApprovedUsers;
