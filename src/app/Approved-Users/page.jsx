"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Image from "next/image";
import useGetUsers from "@/app/hooks/useGetUsers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table"; // Assuming you have a UI table component

const ApprovedUsers = () => {
  const { getUsers, data, loading } = useGetUsers();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState([]);
  const limit = 10;
  const router = useRouter();
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUsers("APPROVED", token, currentPage, limit);
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

  return (
    <div className="p-8 pt-16">
      {loading ? (
        <div className="text-2xl">Loading...</div> // Show loading state
      ) : (
        <>
          <div className="w-1/4 py-[3rem] mx-[3rem] text-[1.5rem]">
            <div className="relative">
              <Search className="w-6 h-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search by OffaNimiID"
                className="pl-12 pr-4 py-2 w-full rounded-lg text-lg border" // Increased text size
              />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden flex-1">
            <Table>
              <TableHeader className="bg-gray-100 text-xl">
                <TableRow>
                  <TableHead className="py-4 px-6 font-bold">Name</TableHead>
                  <TableHead className="py-4 px-6 font-bold">
                    OffaNimID
                  </TableHead>
                  <TableHead className="py-4 px-6 font-bold">NIN</TableHead>
                  <TableHead className="py-4 px-6 font-bold">
                    State Of Residence
                  </TableHead>
                  <TableHead className="py-4 px-6 font-bold">
                    Ward Name
                  </TableHead>
                  <TableHead className="py-4 px-6 font-bold">
                    Compound Name
                  </TableHead>
                  <TableHead className="py-4 px-6 font-bold">
                    Phone Number
                  </TableHead>
                  <TableHead className="py-4 px-6 font-bold">
                    ID Payment
                  </TableHead>
                  <TableHead className="py-4 px-6 font-bold">
                    Date Added
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers?.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-gray-50 cursor-pointer text-xl"
                      onClick={() => handleRowClick(user)}
                    >
                      <TableCell className="py-4 px-6 flex items-center">
                        <Image
                          src="/home/offa_logo.svg"
                          alt="User"
                          className="w-8 h-8 rounded-full mr-2"
                          height={20}
                          width={20}
                        />
                        {user.firstName} {user.middleName} {user.lastName}
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        {user.offaNimiId}
                      </TableCell>
                      <TableCell className="py-4 px-6">{user.nin}</TableCell>
                      <TableCell className="py-4 px-6">
                        {user.stateOfResidence}
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        {user.wardName}
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        {user.compoundName}
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        {user.phoneNumber}
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        {user.idPayment.toString()}
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="py-5 px-6 text-center text-lg"
                    >
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="bg-white py-4 px-6 border-t flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Showing {filteredUsers?.length} of {data.pagination?.totalUsers}{" "}
                users
              </span>
              <div className="flex items-center">
                <button
                  onClick={handlePrevPage}
                  className={`px-2 py-1 border rounded-l-md hover:bg-gray-100 ${
                    currentPage === 1 && "cursor-not-allowed opacity-50"
                  }`}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="px-4 py-2 border-t border-b">
                  {currentPage}
                </span>
                <button
                  onClick={handleNextPage}
                  className={`px-2 py-1 border rounded-r-md hover:bg-gray-100 ${
                    currentPage === totalPages &&
                    "cursor-not-allowed opacity-50"
                  }`}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ApprovedUsers;
