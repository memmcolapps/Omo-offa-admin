import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export function ReusableTable({
  columns,
  data,
  currentPage,
  totalPages,
  totalItems,
  handlePrevPage,
  handleNextPage,
  handleRowClick,
  emptyMessage = "No items found.",
  hasMore = false,
  hasPrevious = false,
}) {
  // Calculate the range of items being shown
  const itemsPerPage = 20;
  const safeTotalItems = totalItems || 0;
  const startItem = data?.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem =
    data?.length > 0 ? (currentPage - 1) * itemsPerPage + data.length : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col w-full">
      <div className="overflow-x-auto flex-grow">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5">
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              <Table className="min-w-full table-auto">
                <TableHeader className="bg-gray-50 sticky top-0 z-10">
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead
                        key={column.key}
                        className="py-3 px-3 text-sm font-semibold text-gray-700 border-b border-gray-200 max-w-[200px]"
                      >
                        <div className="truncate" title={column.header}>
                          {column.header}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.length > 0 ? (
                    data?.map((item, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-gray-50 cursor-pointer text-sm border-b border-gray-100 transition-colors"
                        onClick={() => handleRowClick(item)}
                      >
                        {columns.map((column) => {
                          const cellValue = item[column.key]?.toString() || "-";
                          return (
                            <TableCell
                              key={column.key}
                              className="py-4 px-3 max-w-[200px]"
                            >
                              {column.render ? (
                                column.render(item)
                              ) : (
                                <div
                                  className="truncate text-gray-900 cursor-help"
                                  title={cellValue}
                                >
                                  {cellValue}
                                </div>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="py-8 px-6 text-center text-gray-500"
                      >
                        {emptyMessage}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Pagination */}
      <div className="bg-white py-4 px-6 flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 gap-4">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{startItem}</span> to{" "}
          <span className="font-medium">{endItem}</span> of{" "}
          <span className="font-medium">
            {safeTotalItems > 0 ? safeTotalItems : `${endItem}+`}
          </span>{" "}
          results
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevPage}
            className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
              !hasPrevious && currentPage === 1
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            }`}
            disabled={!hasPrevious && currentPage === 1}
          >
            <ChevronLeft size={16} className="inline mr-1" />
            Previous
          </button>

          <div className="flex items-center space-x-1">
            <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <button
            onClick={handleNextPage}
            className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
              !hasMore && currentPage === totalPages
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            }`}
            disabled={!hasMore && currentPage === totalPages}
          >
            Next
            <ChevronRight size={16} className="inline ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
