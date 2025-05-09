"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Clock, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { SubscriptionLoader } from "../loaders/subscription-loader";
import { AddSubscriptionDialog } from "./add-subscription-dialog";
import { deleteSubscription, getSubscriptions } from "./home.action";

export function ActiveSubscriptions() {
  const session = useSession();
  const queryClient = useQueryClient();
  const [subscriptionToDelete, setSubscriptionToDelete] = useState<
    string | null
  >(null);

  const { data: subscriptions } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const subscriptions = await getSubscriptions(
        session.data?.user?.id as string
      );
      return subscriptions;
    },
    enabled: !!session.data?.user?.id,
  });

  const { mutate: removeSubscription } = useMutation({
    mutationFn: async (id: string) => await deleteSubscription(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["subscriptions"],
      });
      toast.success("Subscription deleted successfully");
      setSubscriptionToDelete(null);
    },
    onError: () => {
      toast.error("Failed to delete subscription");
      setSubscriptionToDelete(null);
    },
  });

  // Show loader while session is loading
  if (session.status === "loading") {
    return <SubscriptionLoader />;
  }

  function formatCurrency(currency: string, amount: number) {
    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 0,
    });

    return formatter.format(amount);
  }

  // Find subscription by ID
  const getSubscriptionName = (id: string | null) => {
    if (!id) return "";
    const subscription = subscriptions?.find((s) => s.id === id);
    return subscription ? subscription.name : "";
  };

  return (
    <Card className="border-2 hover:border-primary/20 transition-colors duration-300">
      <CardHeader className="p-4 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Your Subscriptions
          </CardTitle>
          {/* Pass only the id from the session user */}
          <AddSubscriptionDialog
            user={
              session.data?.user
                ? {
                    id: session.data.user.id,
                  }
                : null
            }
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
        <div className="space-y-3">
          {/* Header row for subscriptions */}
          <div className="grid grid-cols-12 px-3 py-2 text-xs font-medium text-muted-foreground">
            <div className="col-span-5">Name</div>
            <div className="col-span-3 text-center">Renewal</div>
            <div className="col-span-3 text-right">Amount</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          {subscriptions?.map((subscription) => (
            <div
              key={subscription.id}
              className="grid grid-cols-12 items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-all duration-300 group"
            >
              {/* Name and status icon */}
              <div className="col-span-5 flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 ${
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
                <div className="overflow-hidden">
                  <p className="text-sm font-medium leading-none truncate group-hover:text-primary transition-colors duration-300">
                    {subscription.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {subscription.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>

              {/* Renewal date */}
              <div className="col-span-3 text-center">
                <p className="text-xs text-muted-foreground">
                  {subscription.renewalDate < new Date() ? (
                    <span className="text-amber-600 font-medium">Due soon</span>
                  ) : (
                    <span className="text-green-600 font-medium">Upcoming</span>
                  )}
                </p>
                <p className="text-xs">
                  {new Date(subscription.renewalDate).toLocaleDateString()}
                </p>
              </div>

              {/* Amount */}
              <div className="col-span-3 text-right">
                <p className="font-semibold text-sm">
                  {formatCurrency(subscription.currency, subscription.amount)}
                </p>
                <p className="text-xs text-muted-foreground">per month</p>
              </div>

              {/* Action buttons */}
              <div className="col-span-1 text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  title="Delete subscription"
                  className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-100 transition-colors"
                  onClick={() => setSubscriptionToDelete(subscription.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {subscriptions?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No active subscriptions found.</p>
              <p className="text-xs mt-1">
                Add your first subscription to start tracking.
              </p>
            </div>
          )}
        </div>
      </CardContent>

      {/* Confirmation Dialog */}
      <Dialog
        open={!!subscriptionToDelete}
        onOpenChange={(open) => !open && setSubscriptionToDelete(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the subscription to{" "}
              <span className="font-medium text-foreground">
                {getSubscriptionName(subscriptionToDelete)}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setSubscriptionToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (subscriptionToDelete) {
                  removeSubscription(subscriptionToDelete);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
