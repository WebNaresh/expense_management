"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { FieldValues, Path, useFormContext } from "react-hook-form";

interface InputSwitchProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  description?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

const InputSwitch = <T extends FieldValues>({
  label,
  name,
  description,
  className,
  disabled = false,
  required = false,
}: InputSwitchProps<T>) => {
  const form = useFormContext<T>();

  if (!form) {
    throw new Error("InputSwitch must be used within a FormProvider");
  }

  return (
    <FormField
      control={form.control}
      name={name}
      disabled={disabled}
      render={({ field }) => (
        <FormItem
          className={cn(
            "flex flex-row items-center justify-between rounded-lg border p-4",
            className
          )}
        >
          <div className="space-y-0.5">
            <FormLabel className="text-base">{label}</FormLabel>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage className="text-xs font-medium text-destructive mt-1 animate-in fade-in-50" />
        </FormItem>
      )}
    />
  );
};

export default InputSwitch;
