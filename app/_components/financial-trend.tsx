"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

interface FinancialData {
  date: string;
  balance: number;
}

interface FinancialTrendProps {
  data: FinancialData[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col">
          <span className="text-[0.70rem] uppercase text-muted-foreground">
            Date
          </span>
          <span className="font-bold text-sm">{label}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[0.70rem] uppercase text-muted-foreground">
            Balance
          </span>
          <span className="font-bold text-sm">
            ₹{payload[0].value?.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export function FinancialTrend({ data }: FinancialTrendProps) {
  return (
    <Card className="col-span-full">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg">Money Overview</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
        <div className="h-[200px] sm:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--muted-foreground))"
                opacity={0.1}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(value) => {
                  // On small screens, show shorter date format
                  if (window.innerWidth < 640) {
                    return value.split(" ")[1]; // Just show the day number
                  }
                  return value;
                }}
              />
              <YAxis
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                width={65}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "hsl(var(--muted-foreground))",
                  strokeWidth: 1,
                }}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="green"
                strokeWidth={2.5}
                dot={{
                  r: 4,
                  fill: "green",
                  strokeWidth: 2,
                  stroke: "#77b577",
                }}
                activeDot={{
                  r: 6,
                  fill: "green",
                  stroke: "#77b577",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 rounded-md bg-muted/50 p-3">
          <p className="text-xs sm:text-sm">
            <span className="font-medium">Quick Tip:</span> You&apos;ve spent
            20% more this month on subscriptions compared to last month.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
