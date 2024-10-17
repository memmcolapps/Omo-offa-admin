{/* <div className="flex-grow overflow-auto">
        <table className="min-w-full bg-white">
          <thead className="sticky top-0 bg-white shadow-sm">
            <tr className="text-left text-gray-600 text-sm">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">OffaNimID</th>
              <th className="py-3 px-4">NIN</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">ID card status</th>
              <th className="py-3 px-4">Date Added</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((user, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4 flex items-center">
                  <Image
                    src="/home/offa_logo.svg"
                    alt="User"
                    className="w-8 h-8 rounded-full mr-2"
                    height={20}
                    width={20}
                  />
                  {user.name}
                </td>
                <td className="py-3 px-4">{user.offaNimID}</td>
                <td className="py-3 px-4">{user.nin}</td>
                <td className="py-3 px-4">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.idCardStatus === "Received"
                        ? "bg-green-100 text-green-800"
                        : user.idCardStatus === "Payment Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.idCardStatus}
                  </span>
                </td>
                <td className="py-3 px-4">{user.dateAdded}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white py-4 px-6 border-t flex justify-between items-center">
        <span className="text-sm text-gray-600">Showing 10 of 300</span>
        <div className="flex items-center">
          <button className="px-2 py-1 border rounded-l-md hover:bg-gray-100">
            <ChevronLeft size={20} />
          </button>
          <button className="px-3 py-1 border-t border-b bg-green-800 text-white">
            1
          </button>
          <button className="px-3 py-1 border-t border-b hover:bg-gray-100">
            2
          </button>
          <button className="px-3 py-1 border-t border-b hover:bg-gray-100">
            3
          </button>
          <button className="px-3 py-1 border-t border-b hover:bg-gray-100">
            4
          </button>
          <button className="px-2 py-1 border rounded-r-md hover:bg-gray-100">
            <ChevronRight size={20} />
          </button>
        </div>
      </div> */}


      import React from "react";
import Image from "next/image";
import MaxContainer from "../common/maxcontainer";

const userData = [
  {
    name: "Moshood Alimi Abiola",
    offaNimID: "1254673252***",
    nin: "1254673252***",
    status: "Rejected",
    idCardStatus: "Received",
    dateAdded: "15-10-2024",
  },
  {
    name: "Moshood Alimi Abiola",
    offaNimID: "1254673252***",
    nin: "1254673252***",
    status: "Rejected",
    idCardStatus: "Received",
    dateAdded: "15-10-2024",
  },
  {
    name: "Moshood Alimi Abiola",
    offaNimID: "1254673252***",
    nin: "1254673252***",
    status: "Rejected",
    idCardStatus: "Received",
    dateAdded: "15-10-2024",
  },
  {
    name: "Moshood Alimi Abiola",
    offaNimID: "1254673252***",
    nin: "1254673252***",
    status: "Rejected",
    idCardStatus: "Received",
    dateAdded: "15-10-2024",
  },
  {
    name: "Moshood Alimi Abiola",
    offaNimID: "1254673252***",
    nin: "1254673252***",
    status: "Rejected",
    idCardStatus: "Received",
    dateAdded: "15-10-2024",
  },
];

const PendingUserTable = () => {
  return (
    <MaxContainer>
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg mx-[3rem]">
        <table className="table-auto w-full text-left bg-white">
          <thead className="sticky top-0 bg-gray-100 shadow-sm">
            <tr className="text-black text-[1rem]">
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">OffaNimID</th>
              <th className="py-4 px-6">NIN</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">ID Card Status</th>
              <th className="py-4 px-6">Date Added</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((user, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="py-4 px-6 flex items-center">
                  <Image
                    src="/home/offa_logo.svg"
                    alt="User"
                    className="w-8 h-8 rounded-full mr-2"
                    height={20}
                    width={20}
                  />
                  {user.name}
                </td>
                <td className="py-4 px-6">{user.offaNimID}</td>
                <td className="py-4 px-6">{user.nin}</td>
                <td className="py-4 px-6">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                    {user.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.idCardStatus === "Received"
                        ? "bg-green-100 text-green-800"
                        : user.idCardStatus === "Payment Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.idCardStatus}
                  </span>
                </td>
                <td className="py-4 px-6">{user.dateAdded}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MaxContainer>
  );
};

export default PendingUserTable;
