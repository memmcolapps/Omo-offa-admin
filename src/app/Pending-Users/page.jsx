"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useGetUsers from "@/app/hooks/useGetUsers";
import { Input } from "@/app/components/ui/input";
import { Search } from "lucide-react";
import { ReusableTable } from "../components/common/table";

const PendingUsers = () => {
  const { getUsers, data, loading } = useGetUsers();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState([]);
  const limit = 10;

  useEffect(() => {
    const token = localStorage.getItem("token");
    getUsers("PENDING", token, currentPage, limit);
    console.log(data);
  }, [currentPage]);

  useEffect(() => {
    if (data) {
      setUsers(data.users);
      setTotalPages(data.pagination?.totalPages || 1);
    }
  }, [data]);

  const filteredData = users?.filter((user) =>
    user.offaNimiId.toLowerCase().includes(filter.toLowerCase())
  );

  const handleNextPage = () => {
    if (currentPage < totalNumberOfPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRowClick = (user) => {
    const userEncoded = encodeURIComponent(JSON.stringify(user)); // Convert user object to a string
    router.push(`/Pending-Users/user?user=${userEncoded}`);
  };

  const columns = [
    { key: "firstName", header: "Name" },
    { key: "offaNimiId", header: "OffaNimID" },
    { key: "email", header: "Email" },
    { key: "stateOfResidence", header: "State Of Residence" },
    { key: "wardName", header: "Ward Name" },
    { key: "compoundName", header: "Compound Name" },
    { key: "phoneNumber", header: "Phone Number" },
    { key: "createdAt", header: "Date Added" },
  ];

  return (
    <div className="p-10 pt-10 w-full">
      {loading ? (
        <div className="text-2xl">Loading...</div> // Show loading state
      ) : (
        <>
          <div className="w-1/4 py-[3rem] text-[2rem]">
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

export default PendingUsers;
