"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoader() {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col gap-4">
      {/* Header Section */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-8 w-32" />
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Balance Cards */}
      <div className="flex flex-row gap-4">
        {/* Your Balance */}
        <Card className="w-full overflow-hidden rounded-lg border p-0 max-w-sm">
          <div className="bg-emerald-500/20 p-4 rounded-t-lg">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="p-6">
            <Skeleton className="h-10 w-40 mb-2" />
            <Skeleton className="h-4 w-36" />
          </div>
        </Card>

        {/* Money You Owe */}
        <Card className="w-full overflow-hidden rounded-lg border p-0 max-w-sm">
          <div className="bg-red-600/20 p-4 rounded-t-lg">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="p-6">
            <Skeleton className="h-10 w-40" />
          </div>
        </Card>

        {/* Money to Collect */}
        <Card className="w-full overflow-hidden rounded-lg border p-0 max-w-sm">
          <div className="bg-[#0A2647]/20 p-4 rounded-t-lg">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="p-6">
            <Skeleton className="h-10 w-40" />
          </div>
        </Card>
      </div>

      {/* Monthly Expenses Section */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-24" />
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Expenses and Active Subscriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Expenses */}
        <Card className="p-6">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </Card>

        {/* Active Subscriptions */}
        <Card className="p-6">
          <Skeleton className="h-6 w-40 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Financial Trend */}
      <Card className="p-6">
        <Skeleton className="h-6 w-32 mb-6" />
        <Skeleton className="h-[200px] w-full rounded-lg" />
      </Card>

      {/* Recent Transactions */}
      <Card className="p-6">
        <Skeleton className="h-6 w-40 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
