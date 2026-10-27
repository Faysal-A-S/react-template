import { QueryClient } from "@tanstack/react-query";
import { isXiorError } from "xior";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60_000,
            gcTime: 10 * 60_000,
            retry: (count, error) => {
                if (
                    isXiorError(error) &&
                    error.response &&
                    error.response.status >= 400 &&
                    error.response.status < 500
                )
                    return false;
                return count < 2;
            },
        },
        mutations: { retry: false },
    },
});
