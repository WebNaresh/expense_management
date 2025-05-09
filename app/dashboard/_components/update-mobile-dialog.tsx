"use client";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Phone, Smartphone } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { updateMobileNumber } from "./profile.action";

// Common country codes
const countryCodes = [
  { value: "91", label: "IN (91)" },
  { value: "1", label: "USA (1)" },
  { value: "44", label: "UK (44)" },
  { value: "61", label: "AU (61)" },
  { value: "86", label: "CN (86)" },
  { value: "971", label: "AE (971)" },
  { value: "65", label: "SG (65)" },
  { value: "49", label: "DE (49)" },
];

const formSchema = z.object({
  countryCode: z.string().min(1, { message: "Country code is required" }),
  phoneNumber: z
    .string()
    .min(5, { message: "Phone number must be at least 5 digits" })
    .max(15, { message: "Phone number must be at most 15 digits" })
    .regex(/^[0-9]+$/, {
      message: "Phone number must contain only digits",
    }),
});

export type MobileFormValues = z.infer<typeof formSchema>;

interface UpdateMobileDialogProps {
  userId: string;
  currentNumber: string | null | undefined;
  onSuccess: () => void;
  initiallyOpen?: boolean;
}

export function UpdateMobileDialog({
  userId,
  currentNumber,
  onSuccess,
  initiallyOpen = false,
}: UpdateMobileDialogProps) {
  const [open, setOpen] = useState(initiallyOpen);

  // Parse current number into country code and phone number
  const parsePhoneNumber = (phoneNumber: string | null | undefined) => {
    // Default values
    let countryCode = "91";
    let number = "";

    // Check if the phone number exists and is not null
    if (phoneNumber && phoneNumber !== "null" && phoneNumber !== "undefined") {
      // Find matching country code
      const foundCountryCode = countryCodes.find((code) =>
        phoneNumber.startsWith(code.value)
      );

      if (foundCountryCode) {
        countryCode = foundCountryCode.value;
        number = phoneNumber.substring(foundCountryCode.value.length);
      } else {
        // If no country code is found but number exists, just use the number
        number = phoneNumber;
      }
    }

    return { countryCode, phoneNumber: number };
  };

  const { countryCode, phoneNumber } = parsePhoneNumber(currentNumber);

  const form = useForm<MobileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      countryCode,
      phoneNumber,
    },
  });

  const { mutate: updateMobile, isPending } = useMutation({
    mutationFn: async (data: MobileFormValues) =>
      await updateMobileNumber({
        userId,
        mobileNumber: `${data.countryCode}${data.phoneNumber}`,
      }),
    onSuccess: () => {
      toast.success("Mobile number updated successfully");
      setOpen(false);
      onSuccess();

      form.reset();
    },
    onError: () => {
      toast.error("Failed to update mobile number");
    },
  });

  function onSubmit(data: MobileFormValues) {
    updateMobile(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="flex items-center gap-2">
          <Smartphone className="h-4 w-4" />
          Update Mobile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Mobile Number</DialogTitle>
          <DialogDescription>
            Enter your new mobile number below. We&apos;ll use this for
            notifications and alerts.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <FormLabel className="text-sm font-medium">
                  Phone Number
                </FormLabel>
                <div className="flex items-center mt-2 gap-1">
                  <FormField
                    control={form.control}
                    name="countryCode"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="Country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countryCodes.map((code) => (
                            <SelectItem key={code.value} value={code.value}>
                              {code.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="relative flex-1">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              placeholder="9876543210"
                              className="pl-10 w-full"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto"
              >
                {isPending ? "Updating..." : "Update Number"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
