import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, ShoppingBag, Train } from "lucide-react";
import type React from "react";

interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  icon: React.ReactNode;
}

const getIconForCategory = (category: string) => {
  switch (category.toLowerCase()) {
    case "food":
      return <Coffee className="h-4 w-4" />;
    case "travel":
      return <Train className="h-4 w-4" />;
    default:
      return <ShoppingBag className="h-4 w-4" />;
  }
};

interface RecentExpensesProps {
  expenses: Expense[];
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg">Recent Spending</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-muted">
                  {expense.icon || getIconForCategory(expense.category)}
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {expense.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {expense.date}
                  </p>
                </div>
              </div>
              <p className="font-medium text-sm sm:text-base">
                ₹{expense.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
