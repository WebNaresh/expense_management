"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const ApplicationClientWrapper: React.FC<Props> = (props) => {
  const queryClient = new QueryClient();
  return (
    <React.Fragment>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </React.Fragment>
  );
};

export default ApplicationClientWrapper;
