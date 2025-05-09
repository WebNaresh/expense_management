"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Home, Utensils, Wifi } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { AddMonthlyExpenseDialog } from "./add-monthly-expense-dialog";

interface MonthlyExpense {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  category: string;
  icon: React.ReactNode;
}

const getIconForCategory = (category: string) => {
  switch (category.toLowerCase()) {
    case "housing":
      return <Home className="h-4 w-4" />;
    case "food":
      return <Utensils className="h-4 w-4" />;
    case "utilities":
      return <Wifi className="h-4 w-4" />;
    default:
      return <Calendar className="h-4 w-4" />;
  }
};

interface MonthlyExpensesProps {
  initialExpenses?: MonthlyExpense[];
}

export function MonthlyExpenses({
  initialExpenses = [],
}: MonthlyExpensesProps) {
  const [expenses, setExpenses] = useState<MonthlyExpense[]>(initialExpenses);

  // Calculate total and paid amounts
  const totalAmount = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const paidAmount = expenses.reduce(
    (sum, expense) => (expense.isPaid ? sum + expense.amount : sum),
    0
  );
  const paidPercentage =
    totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;

  const handleAddExpense = (values: {
    name: string;
    amount: number;
    category: string;
    dueDate: number;
    isPaid: boolean;
  }) => {
    const newExpense: MonthlyExpense = {
      id: Math.random().toString(36).substring(7),
      name: values.name,
      amount: values.amount,
      dueDate: `${values.dueDate}${getDaySuffix(values.dueDate)}`,
      isPaid: values.isPaid,
      category: values.category,
      icon: getIconForCategory(values.category),
    };

    setExpenses((prev) => [...prev, newExpense]);
  };

  // Helper function to get the day suffix (st, nd, rd, th)
  function getDaySuffix(day: number) {
    if (day >= 11 && day <= 13) return "th";

    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <CardTitle className="text-lg truncate">
          Monthly Fixed Expenses
        </CardTitle>
        <AddMonthlyExpenseDialog onSubmit={handleAddExpense} />
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Payment Progress
            </span>
            <span className="text-sm font-medium">{paidPercentage}%</span>
          </div>
          <Progress value={paidPercentage} className="h-2" />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              ₹{paidAmount.toLocaleString()} paid
            </span>
            <span className="text-xs text-muted-foreground">
              ₹{totalAmount.toLocaleString()} total
            </span>
          </div>
        </div>
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full ${
                    expense.isPaid
                      ? "bg-green-100 text-green-600"
                      : "bg-amber-100 text-amber-600"
                  }`}
                >
                  {expense.icon || getIconForCategory(expense.category)}
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {expense.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Due: {expense.dueDate}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="font-medium text-sm sm:text-base">
                  ₹{expense.amount.toLocaleString()}
                </p>
                <span
                  className={`text-xs ${
                    expense.isPaid ? "text-green-600" : "text-amber-600"
                  }`}
                >
                  {expense.isPaid ? "Paid" : "Pending"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
