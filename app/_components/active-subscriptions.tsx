import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock } from "lucide-react";

interface Subscription {
  id: string;
  name: string;
  amount: number;
  renewalDate: string;
  isActive: boolean;
  isRenewalSoon: boolean;
}

interface ActiveSubscriptionsProps {
  subscriptions: Subscription[];
}

export function ActiveSubscriptions({
  subscriptions,
}: ActiveSubscriptionsProps) {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg">Your Subscriptions</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
        <div className="space-y-4">
          {subscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full ${
                    subscription.isActive
                      ? subscription.isRenewalSoon
                        ? "bg-amber-100 text-amber-600"
                        : "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {subscription.isRenewalSoon ? (
                    <Clock className="h-4 w-4" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {subscription.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {subscription.isRenewalSoon ? "Renews soon: " : "Renews: "}{" "}
                    {subscription.renewalDate}
                  </p>
                </div>
              </div>
              <p className="font-medium text-sm sm:text-base">
                ₹{subscription.amount.toLocaleString()}/mo
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
