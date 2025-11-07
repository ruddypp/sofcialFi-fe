'use client';

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { ThirdwebProvider } from "thirdweb/react";
import { thirdwebClient } from "./config";

const queryClient = new QueryClient();
export const Providers = ({children}: {children: React.ReactNode}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider client={thirdwebClient}>
        {children}
      </ThirdwebProvider>
    </QueryClientProvider>
  )
}



