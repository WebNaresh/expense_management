import { FormField } from "@/components/ui/form";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { InputFieldProps } from "../../InputField";
import AddressInput from "./components/mini_form";

const InputAddress: React.FC<Omit<InputFieldProps, "form">> = (props) => {
  const { name } = props;
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const form = useFormContext();

  if (!form) {
    throw new Error("InputAddress must be used within a FormProvider");
  }

  useEffect(() => {
    let script: HTMLScriptElement | undefined;

    if (!window.google) {
      script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      setScriptLoaded(true);
    }

    return () => {
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [apiKey]);

  if (!scriptLoaded) {
    return <p>Loading Script...</p>; // or return a loading spinner
  }

  return (
    <FormField
      disabled={props.disabled}
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <AddressInput
            field={field}
            inputProps={{
              ...props,
              Icon: props.Icon,
            }}
          />
        );
      }}
    />
  );
};

export default React.memo(InputAddress);
