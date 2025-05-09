"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Check, Clock } from "lucide-react";
import { AddSubscriptionDialog } from "./add-subscription-dialog";
import { getSubscriptions } from "./home.action";

interface ActiveSubscriptionsProps {}

export function ActiveSubscriptions({}: ActiveSubscriptionsProps) {
  const { data: subscriptions } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: getSubscriptions,
    initialData: [],
  });

  return (
    <Card className="border-2 hover:border-primary/20 transition-colors duration-300">
      <CardHeader className="p-4 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Your Subscriptions
          </CardTitle>
          <AddSubscriptionDialog />
        </div>
        <CardDescription className="text-muted-foreground/80">
          Here are the subscriptions you have active.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
        <div className="space-y-4">
          {subscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className="group flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 ${
                    subscription.isActive
                      ? subscription.renewalDate < new Date()
                        ? "bg-amber-100 text-amber-600 group-hover:bg-amber-200"
                        : "bg-green-100 text-green-600 group-hover:bg-green-200"
                      : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                  }`}
                >
                  {subscription.renewalDate < new Date() ? (
                    <Clock className="h-5 w-5" />
                  ) : (
                    <Check className="h-5 w-5" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors duration-300">
                    {subscription.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {subscription.renewalDate < new Date() ? (
                      <span className="text-amber-600 font-medium">
                        Renews soon:{" "}
                      </span>
                    ) : (
                      <span className="text-green-600 font-medium">
                        Renews:{" "}
                      </span>
                    )}
                    {subscription.renewalDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="font-semibold text-sm sm:text-base">
                  ₹{subscription.amount.toLocaleString()}
                  <span className="text-xs text-muted-foreground">/mo</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {subscription.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          ))}

          {subscriptions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No active subscriptions found.</p>
              <p className="text-xs mt-1">
                Add your first subscription to start tracking.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
