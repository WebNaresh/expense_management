"use client";

import { Card } from "@/components/ui/card";
import { ArrowUp } from "lucide-react";
import { useSession } from "next-auth/react";
import { useQueryState } from "nuqs";
import { ActiveSubscriptions } from "./_components/active-subscriptions";
import { AddExpenseDialog } from "./_components/add-expense-dialog";
import { AddLoanDialog } from "./_components/add-loan-dialog";
import { AddSubscriptionDialog } from "./_components/add-subscription-dialog";
import { FinancialTrend } from "./_components/financial-trend";
import { RecentTransactions } from "./_components/recent-transactions";
import { UpdateMobileDialog } from "./_components/update-mobile-dialog";
import DashboardLoader from "./loader";

// Sample data
const balanceData = {
  balance: 12000,
  change: 5.2,
};

const summaryData = {
  totalOwed: 5000,
  totalReceived: 7000,
};

const financialTrendData = [
  { date: "Apr 1", balance: 10000 },
  { date: "Apr 5", balance: 11200 },
  { date: "Apr 10", balance: 10800 },
  { date: "Apr 15", balance: 11500 },
  { date: "Apr 20", balance: 11000 },
  { date: "Apr 25", balance: 12500 },
  { date: "Apr 30", balance: 12000 },
];

const transactionsData = [
  {
    id: "1",
    date: "May 6, 2023",
    description: "Grocery Shopping",
    amount: 1500,
    category: "Food",
    status: "Paid" as const,
  },
  {
    id: "2",
    date: "May 5, 2023",
    description: "Uber Ride",
    amount: 350,
    category: "Transport",
    status: "Paid" as const,
  },
  {
    id: "3",
    date: "May 4, 2023",
    description: "Movie Tickets",
    amount: 800,
    category: "Entertainment",
    status: "Paid" as const,
  },
  {
    id: "4",
    date: "May 3, 2023",
    description: "Electricity Bill",
    amount: 1200,
    category: "Utilities",
    status: "Pending" as const,
  },
  {
    id: "5",
    date: "May 2, 2023",
    description: "Phone Bill",
    amount: 499,
    category: "Utilities",
    status: "Overdue" as const,
  },
];

export default function Dashboard() {
  const { data: session, status, update } = useSession();
  console.log(`🚀 ~ session:`, session);
  const [isWhatsappConnected, setIsWhatsappConnected] = useQueryState(
    "isWhatsappConnected",
    {
      defaultValue: false,
      parse: (value) => value === "true",
    }
  );

  if (status === "loading") {
    return <DashboardLoader />;
  }

  if (isWhatsappConnected) {
    if (session?.user) {
      setIsWhatsappConnected(false);
    }
  }

  // Handle successful mobile number update
  const handleMobileUpdate = async () => {
    // Refresh the session to get the updated user data
    await update();
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col gap-4">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {session?.user && (
            <UpdateMobileDialog
              userId={session.user.id}
              currentNumber={session.user.whatsappNumber}
              onSuccess={handleMobileUpdate}
              initiallyOpen={!session.user.whatsappNumber}
            />
          )}
          <AddExpenseDialog />
          <AddSubscriptionDialog
            user={
              session?.user
                ? {
                    id: session.user.id,
                  }
                : null
            }
          />
          <AddLoanDialog />
        </div>
      </div>

      <div className="flex flex-row flex-wrap gap-4 mb-6">
        <Card className="w-full overflow-hidden rounded-lg border p-0 max-w-sm">
          <div className="bg-emerald-500 p-4 rounded-t-lg">
            <h3 className="text-lg font-medium text-white">Your Balance</h3>
          </div>
          <div className="p-6">
            <p className="text-4xl font-bold mb-2">
              ₹{balanceData.balance.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 text-sm text-emerald-600">
              <ArrowUp className="h-4 w-4" />
              <span>+{balanceData.change}% from last month</span>
            </div>
          </div>
        </Card>

        <Card className="w-full overflow-hidden rounded-lg border p-0 max-w-sm">
          <div className="bg-red-600 p-4 rounded-t-lg">
            <h3 className="text-lg font-medium text-white">Money You Owe</h3>
          </div>
          <div className="p-6">
            <p className="text-4xl font-bold">
              ₹{summaryData.totalOwed.toLocaleString()}
            </p>
          </div>
        </Card>

        <Card className="w-full overflow-hidden rounded-lg border p-0 max-w-sm">
          <div className="bg-[#0A2647] p-4 rounded-t-lg">
            <h3 className="text-lg font-medium text-white">Money to Collect</h3>
          </div>
          <div className="p-6">
            <p className="text-4xl font-bold">
              ₹{summaryData.totalReceived.toLocaleString()}
            </p>
          </div>
        </Card>
      </div>

      <ActiveSubscriptions />
      <div className="grid gap-6">
        <FinancialTrend data={financialTrendData} />
        <RecentTransactions transactions={transactionsData} />
      </div>
    </div>
  );
}
