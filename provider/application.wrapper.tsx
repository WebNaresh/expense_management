"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { NuqsAdapter } from "nuqs/adapters/next";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

const ApplicationClientWrapper = ({ children }: Props) => {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      <QueryClientProvider client={queryClient}>
        {" "}
        <NuqsAdapter>{children}</NuqsAdapter>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default ApplicationClientWrapper;
