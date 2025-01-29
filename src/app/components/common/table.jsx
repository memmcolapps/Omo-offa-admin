import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";

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
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col w-full">
      <div className="overflow-auto flex-grow">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5">
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              <Table className="min-w-full table-fixed">
                <TableHeader className="bg-white sticky top-0 z-10">
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead
                        key={column.key}
                        className="py-3 px-2 text-xs sm:text-sm lg:text-base font-semibold"
                      >
                        <div className="truncate">{column.header}</div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.length > 0 ? (
                    data?.map((item, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-gray-50 cursor-pointer text-xs sm:text-sm lg:text-xl"
                        onClick={() => handleRowClick(item)}
                      >
                        {columns.map((column) => (
                          <TableCell key={column.key} className="py-5 px-2">
                            {column.render ? (
                              column.render(item)
                            ) : (
                              <div className="truncate">
                                {item[column.key]?.toString()}
                              </div>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="py-4 px-6 text-center text-base"
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
      <div className="bg-white py-3 px-4 flex justify-between items-center border-t">
        <span className="text-xs sm:text-sm text-gray-700">
          Showing {data?.length} of {totalItems} items
        </span>
        <div className="flex items-center">
          <button
            onClick={handlePrevPage}
            className={`px-2 py-1 border rounded-l-md hover:bg-gray-100 ${
              currentPage === 1 && "cursor-not-allowed opacity-50"
            }`}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="px-3 py-1 border-t border-b text-sm">
            {currentPage}
          </span>
          <button
            onClick={handleNextPage}
            className={`px-2 py-1 border rounded-r-md hover:bg-gray-100 ${
              currentPage === totalPages && "cursor-not-allowed opacity-50"
            }`}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
