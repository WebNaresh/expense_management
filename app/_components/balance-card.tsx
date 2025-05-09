import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

interface BalanceCardProps {
  balance: number;
  change: number;
}

export function BalanceCard({ balance, change }: BalanceCardProps) {
  const isPositive = change >= 0;

  return (
    <Card className="overflow-hidden max-w-sm">
      <CardHeader className="bg-primary p-4">
        <CardTitle className="text-primary-foreground text-lg">
          Your Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-2">
          <p className="text-3xl sm:text-4xl font-bold">
            ₹{balance.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-sm">
            <span className={isPositive ? "text-green-600" : "text-red-600"}>
              {isPositive ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
            </span>
            <span className={isPositive ? "text-green-600" : "text-red-600"}>
              {isPositive ? "+" : ""}
              {change.toLocaleString()}% from last month
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
