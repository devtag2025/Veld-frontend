

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState<QueryClient>(() =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60,
          cacheTime: 1000 * 60 * 5,
          retry: 1,
          refetchOnWindowFocus: false,
        },
        mutations: {
          retry: 0,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
