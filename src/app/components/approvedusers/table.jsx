"use client";
import React, { useState } from "react";
import Image from "next/image";
import MaxContainer from "../common/maxcontainer";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";

const ApprovedUserTable = ({ data }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");

  const filteredData = data.filter((user) =>
    user.offaNimiId.toLowerCase().includes(filter.toLowerCase())
  );

  const usersPerPage = 10;
  const totalNumberOfPages = Math.ceil(data.length / usersPerPage);

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredData.slice(startIndex, endIndex);

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
    router.push(`/Approved-Users/user?user=${userEncoded}`);
  };

  return data.length > 0 ? (
    <MaxContainer>
      <div className="w-1/4 py-[3rem] mx-[3rem] text-[1.5rem]">
        <div className="relative">
          <Search className="w-6 h-6 text-black absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search by OffaNimiID"
            className="border px-[3rem] py-[1rem] w-full"
          />
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg mx-[3rem]">
        <table className="table-auto w-full text-left bg-white">
          <thead className="sticky top-0 bg-gray-100 shadow-sm">
            <tr className="text-black text-[1rem]">
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">OffaNimID</th>
              <th className="py-4 px-6">NIN</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">State Of Residence</th>
              <th className="py-4 px-6">Ward Name</th>
              <th className="py-4 px-6">Compound Name</th>
              <th className="py-4 px-6">Phone Number</th>
              <th className="py-4 px-6">ID CARD Payment</th>
              <th className="py-4 px-6">Date Added</th>
            </tr>
          </thead>
          <tbody className="text-[1.2rem]">
            {currentUsers.map((user, index) => (
              <tr
                key={index}
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(user)}
              >
                <td className="py-4 px-6 flex items-center">
                  <Image
                    src="/home/offa_logo.svg"
                    alt="User"
                    className="w-8 h-8 rounded-full mr-2"
                    height={20}
                    width={20}
                  />
                  {user.firstName} {user.middleName} {user.lastName}
                </td>
                <td className="py-4 px-6">{user.offaNimiId}</td>
                <td className="py-4 px-6">{user.nin}</td>
                <td className="py-4 px-6">
                  <span className="bg-[#D5FFF2] text-[#007A55] px-2 py-1 rounded-full text-xs">
                    {user.verificationStatus}
                  </span>
                </td>
                <td className="py-4 px-6">{user.stateOfResidence}</td>
                <td className="py-4 px-6">{user.wardName}</td>
                <td className="py-4 px-6">{user.compoundName}</td>
                <td className="py-4 px-6">{user.phoneNumber}</td>
                <td className="py-4 px-6">{user.idPayment.toString()}</td>
                <td className="py-4 px-6">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bg-white py-4 px-6 border-t flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Showing {currentUsers.length} of {data.length} users
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
            {[...Array(totalNumberOfPages)].map((_, i) => (
              <button
                key={i}
                className={`px-3 py-1 border-t border-b ${
                  currentPage === i + 1
                    ? "bg-green-800 text-white"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={handleNextPage}
              className={`px-2 py-1 border rounded-r-md hover:bg-gray-100 ${
                currentPage === totalNumberOfPages &&
                "cursor-not-allowed opacity-50"
              }`}
              disabled={currentPage === totalNumberOfPages}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </MaxContainer>
  ) : (
    <div className="flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">No Approved Users</h1>
        <p className="text-gray-600">
          There are no Approved users at the moment. Please check back later.
        </p>
      </div>
    </div>
  );
};

export default ApprovedUserTable;
