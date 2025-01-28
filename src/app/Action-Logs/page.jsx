"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import MaxContainer from "@/app/components/common/maxcontainer";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import useGetLogs from "../hooks/useGetLogs";
import { useRouter } from "next/navigation";

export default function AdminActionsLog() {
  const [actions, setActions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("");
  const limit = 10;
  const { getLogs, data, loading } = useGetLogs();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      getLogs(token, currentPage, limit);
    }
  }, [currentPage]); // Removed unnecessary 'filter' dependency

  useEffect(() => {
    if (data) {
      setActions(data.data);
      setTotalPages(data.pagination?.totalPages || 1);
    }
  }, [data]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-8 pt-16">
      <div className="w-1/4 py-[3rem] mx-[3rem] text-[1.5rem]">
        <div className="relative">
          <Search className="w-6 h-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <Input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search by action"
            className="pl-12 pr-4 py-2 w-full rounded-lg text-lg" // Increased text size
          />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden flex-1">
        {" "}
        {/* Allow this div to grow */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className=" bg-white z-10 shadow-sm">
              <TableRow>
                <TableHead className="py-6 px-8 text-2xl font-bold">
                  {" "}
                  {/* Increased font size */}
                  Action
                </TableHead>
                <TableHead className="py-6 px-8 text-2xl font-bold">
                  {" "}
                  {/* Increased font size */}
                  Admin
                </TableHead>
                <TableHead className="py-6 px-8 text-2xl font-bold">
                  {" "}
                  {/* Increased font size */}
                  Timestamp
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="py-5 px-8 text-center text-lg"
                  >
                    {" "}
                    {/* Increased font size */}
                    Loading...
                  </TableCell>
                </TableRow>
              ) : actions?.length > 0 ? (
                actions.map((action) => (
                  <TableRow key={action.id} className="hover:bg-gray-50">
                    <TableCell className="py-5 px-8 text-xl">
                      {action?.action}
                    </TableCell>
                    <TableCell className="py-5 px-8 text-xl">
                      {action?.email}
                    </TableCell>
                    <TableCell className="py-5 px-8 text-xl">
                      {action?.createdAt}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="py-5 px-8 text-center text-lg"
                  >
                    {" "}
                    {/* Increased font size */}
                    No actions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="bg-white py-4 px-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-lg text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center">
            <Button
              onClick={handlePrevPage}
              disabled={currentPage === 1 || loading}
              variant="outline"
              size="icon"
              className="rounded-r-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-4 py-2 border-t border-b">{currentPage}</span>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages || loading}
              variant="outline"
              size="icon"
              className="rounded-l-none"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
