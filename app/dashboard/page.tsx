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
import { MonthlyExpenses } from "./_components/monthly-expenses";
import { RecentExpenses } from "./_components/recent-expenses";
import { RecentTransactions } from "./_components/recent-transactions";
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

const expensesData = [
  {
    id: "1",
    name: "Groceries",
    amount: 1500,
    category: "Food",
    date: "Today",
    icon: null,
  },
  {
    id: "2",
    name: "Uber Ride",
    amount: 350,
    category: "Travel",
    date: "Yesterday",
    icon: null,
  },
  {
    id: "3",
    name: "Movie Tickets",
    amount: 800,
    category: "Entertainment",
    date: "May 5, 2023",
    icon: null,
  },
];

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

const monthlyExpensesData = [
  {
    id: "1",
    name: "Room Rent",
    amount: 8000,
    dueDate: "5th of every month",
    isPaid: true,
    category: "housing",
    icon: null,
  },
  {
    id: "2",
    name: "Mess Fees",
    amount: 3500,
    dueDate: "3rd of every month",
    isPaid: false,
    category: "food",
    icon: null,
  },
  {
    id: "3",
    name: "Internet Bill",
    amount: 999,
    dueDate: "10th of every month",
    isPaid: true,
    category: "utilities",
    icon: null,
  },
  {
    id: "4",
    name: "Gym Membership",
    amount: 1200,
    dueDate: "15th of every month",
    isPaid: false,
    category: "fitness",
    icon: null,
  },
];

export default function Dashboard() {
  const { data: session, status } = useSession();
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
  console.log(`🚀 ~ session?.user:`, session?.user);

  if (isWhatsappConnected) {
    if (session?.user) {
      setIsWhatsappConnected(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col gap-4">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <AddExpenseDialog />
          <AddSubscriptionDialog />
          <AddLoanDialog />
        </div>
      </div>

      <div className="flex flex-row gap-4">
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
      <MonthlyExpenses initialExpenses={monthlyExpensesData} />
      {/* Third row - Recent Expenses and Active Subscriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentExpenses expenses={expensesData} />
        <ActiveSubscriptions />
      </div>
      <div className="grid gap-6">
        <FinancialTrend data={financialTrendData} />
        <RecentTransactions transactions={transactionsData} />
      </div>
    </div>
  );
}
