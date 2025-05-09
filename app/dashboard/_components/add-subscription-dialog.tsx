"use client";

import InputField from "@/components/AppInputFields/InputField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppCurrency, SubscriptionRenewInterval } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Calendar as CalendarIcon2,
  Currency,
  DollarSign,
  PenLine,
  Plus,
  Tags,
  ToggleLeft,
} from "lucide-react";
import { useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { addSubscription } from "./home.action";

const categories = [
  { label: "Entertainment", value: "entertainment" },
  { label: "Productivity", value: "productivity" },
  { label: "Utilities", value: "utilities" },
  { label: "Shopping", value: "shopping" },
  { label: "Health", value: "health" },
  { label: "Education", value: "education" },
  { label: "Other", value: "other" },
];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number.",
  }),
  category: z.enum(
    [
      "entertainment",
      "productivity",
      "utilities",
      "shopping",
      "health",
      "education",
      "other",
    ] as const,
    {
      required_error: "Please select a category.",
    }
  ),
  renewalDate: z.string({
    required_error: "Please select a renewal date.",
  }),
  isActive: z.boolean(),
  hasVariableCharges: z.boolean(),
  currency: z.nativeEnum(AppCurrency),
  renewInterval: z.nativeEnum(SubscriptionRenewInterval),
  userId: z.string(),
});

export type SubscriptionFormValues = z.infer<typeof formSchema>;

// Define simplified user type that only requires the id
type UserWithId = {
  id: string;
};

export function AddSubscriptionDialog({
  user,
}: {
  user: UserWithId | null | undefined;
}) {
  const [open, setOpen] = useQueryState("open", {
    defaultValue: false,
    parse: (value) => value === "true",
    scroll: false,
  });

  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: process.env.NODE_ENV === "development" ? "Netflix" : "",
      amount: process.env.NODE_ENV === "development" ? 499 : 0,
      category:
        process.env.NODE_ENV === "development"
          ? "entertainment"
          : "productivity",
      renewalDate: new Date().toISOString().split("T")[0],
      isActive: true,
      hasVariableCharges: true,
      currency: AppCurrency.INR,
      renewInterval: SubscriptionRenewInterval.MONTHLY,
      userId: user?.id,
    },
  });
  const queryClient = useQueryClient();
  const { mutate: createSubscription } = useMutation({
    mutationFn: async (data: SubscriptionFormValues) =>
      await addSubscription(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["subscriptions", user?.id],
      });
      toast.success("Subscription created successfully");
      form.reset({
        name: process.env.NODE_ENV === "development" ? "Netflix" : "",
        amount: process.env.NODE_ENV === "development" ? 499 : 0,
        category:
          process.env.NODE_ENV === "development"
            ? "entertainment"
            : "productivity",
        renewalDate: new Date().toISOString().split("T")[0],
        isActive: true,
        hasVariableCharges: false,
        currency: AppCurrency.INR,
        userId: user?.id,
      });
      setOpen(false);
    },
    onError: () => {
      toast.error("Failed to create subscription");
    },
  });

  function onSubmit(data: SubscriptionFormValues) {
    createSubscription(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-pointer">
          <Plus className="sm:mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Add Subscription</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-w-[90vw] p-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-4 ">
          <DialogTitle>Add New Subscription</DialogTitle>
          <DialogDescription>
            Enter the details of your subscription below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2 px-4"
          >
            <InputField
              type="text"
              label="Subscription Name"
              name="name"
              placeholder="Netflix"
              required
              Icon={PenLine}
            />

            <InputField
              type="select"
              label="Currency"
              name="currency"
              options={Object.values(AppCurrency).map((currency) => ({
                label: currency,
                value: currency,
              }))}
              required
              Icon={Currency}
            />

            <InputField
              type="number"
              label="Monthly Units"
              name="amount"
              placeholder="499"
              required
              Icon={DollarSign}
            />

            <InputField
              type="select"
              label="Category"
              name="category"
              options={categories}
              required
              isSearchable
              Icon={Tags}
            />

            <InputField
              type="date"
              label="Next Renewal Date"
              name="renewalDate"
              required
              Icon={CalendarIcon2}
            />

            <InputField
              type="select"
              label="Renewal Interval"
              name="renewInterval"
              options={Object.values(SubscriptionRenewInterval).map(
                (interval) => ({
                  label: interval,
                  value: interval,
                })
              )}
              required
              Icon={CalendarIcon2}
            />

            <InputField
              type="switch"
              label="Active Subscription"
              name="isActive"
              description="Is this subscription currently active?"
              Icon={ToggleLeft}
            />

            <InputField
              type="switch"
              label="Variable Charges"
              name="hasVariableCharges"
              description="May have additional/extra charges beyond the base amount"
              Icon={AlertCircle}
            />

            <DialogFooter className="sticky bottom-0 bg-background">
              <Button type="submit">Add Subscription</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
