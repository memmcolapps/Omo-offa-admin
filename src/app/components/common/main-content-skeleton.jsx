"use client";
import React from "react";

const MainContentSkeleton = () => {
  return (
    <div className="flex-1 flex flex-col">
      {/* Navbar Skeleton */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="w-24 h-8 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Main Content Skeleton */}
      <main className="flex-1 overflow-auto pt-4 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Title Skeleton */}
          <div className="mb-8">
            <div className="w-64 h-8 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="w-96 h-4 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Content Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-3" />
                <div className="w-3/4 h-3 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Table Skeleton */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="w-48 h-6 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="w-1/2 h-3 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="w-20 h-6 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainContentSkeleton;
