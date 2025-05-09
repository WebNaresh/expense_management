import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddExpenseDialog } from "./_components/add-expense-dialog";
import { AddLoanDialog } from "./_components/add-loan-dialog";
import { AddSubscriptionDialog } from "./_components/add-subscription-dialog";
import { BalanceCard } from "./_components/balance-card";
// Sample data
const balanceData = {
  balance: 12000,
  change: 5.2,
}

const summaryData = {
  totalOwed: 5000,
  totalReceived: 7000,
}

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
]

const subscriptionsData = [
  {
    id: "1",
    name: "Netflix",
    amount: 499,
    renewalDate: "May 15, 2023",
    isActive: true,
    isRenewalSoon: true,
  },
  {
    id: "2",
    name: "Spotify",
    amount: 119,
    renewalDate: "May 22, 2023",
    isActive: true,
    isRenewalSoon: false,
  },
  {
    id: "3",
    name: "Amazon Prime",
    amount: 179,
    renewalDate: "June 10, 2023",
    isActive: true,
    isRenewalSoon: false,
  },
]

const financialTrendData = [
  { date: "Apr 1", balance: 10000 },
  { date: "Apr 5", balance: 11200 },
  { date: "Apr 10", balance: 10800 },
  { date: "Apr 15", balance: 11500 },
  { date: "Apr 20", balance: 11000 },
  { date: "Apr 25", balance: 12500 },
  { date: "Apr 30", balance: 12000 },
]

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
]

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
]

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
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
      <div className="grid gap-6">
            {/* Financial Cards - Stack on mobile, 3 columns on md and up */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-fit">
              <BalanceCard {...balanceData} />
              <Card className="overflow-hidden max-w-sm">
                <CardHeader className="bg-destructive p-4">
                  <CardTitle className="text-destructive-foreground text-lg">Money You Owe</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <p className="text-3xl sm:text-4xl font-bold">₹{summaryData.totalOwed.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden max-w-sm">
                <CardHeader className="bg-secondary p-4">
                  <CardTitle className="text-secondary-foreground text-lg">Money to Collect</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <p className="text-3xl sm:text-4xl font-bold">₹{summaryData.totalReceived.toLocaleString()}</p>
                </CardContent>
              </Card>
            </div>
    </div>
  );
}
