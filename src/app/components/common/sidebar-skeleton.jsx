"use client";
import React from "react";

const SidebarSkeleton = () => {
  return (
    <aside className="h-screen bg-[#002E20] text-[#C8FFC4]">
      {/* Header Skeleton */}
      <div className="h-48 flex items-center justify-center p-4">
        <div className="w-24 h-10 bg-[#C8FFC4]/20 rounded animate-pulse" />
      </div>

      {/* Menu Items Skeleton */}
      <div className="px-4 space-y-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center px-4 py-3 gap-6 rounded-lg"
          >
            <div className="w-6 h-6 bg-[#C8FFC4]/20 rounded animate-pulse" />
            <div className="h-6 bg-[#C8FFC4]/20 rounded animate-pulse flex-1" />
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
