import React from "react";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";

const LoadingSkeleton = ({ className }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded ${className}`} 
       style={{animation: "shimmer 2s infinite linear"}} />
);

const Loading = ({ type = "dashboard" }) => {
  if (type === "dashboard") {
    return (
      <div className="space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <LoadingSkeleton className="h-4 w-24 mb-2" />
                    <LoadingSkeleton className="h-8 w-16 mb-2" />
                    <LoadingSkeleton className="h-4 w-20" />
                  </div>
                  <LoadingSkeleton className="w-12 h-12 rounded-xl" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 animate-pulse">
            <CardHeader>
              <LoadingSkeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <LoadingSkeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          
          <Card className="animate-pulse">
            <CardHeader>
              <LoadingSkeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center justify-between">
                    <LoadingSkeleton className="h-4 w-24" />
                    <LoadingSkeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (type === "table") {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  {[1, 2, 3, 4, 5].map(i => (
                    <th key={i} className="px-6 py-3">
                      <LoadingSkeleton className="h-4 w-20" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="border-t">
                    {[1, 2, 3, 4, 5].map(j => (
                      <td key={j} className="px-6 py-4">
                        <LoadingSkeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <LoadingSkeleton className="h-6 w-32 mb-2" />
              <LoadingSkeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <LoadingSkeleton className="h-4 w-full" />
                <LoadingSkeleton className="h-4 w-3/4" />
                <LoadingSkeleton className="h-8 w-24 mt-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
    </div>
  );
};

export default Loading;