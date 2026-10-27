import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import { queryClient } from "@/lib/query-client";
import { appStore, authAtom } from "@/store";
import "./index.css";

const router = createRouter({ routeTree });
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}
const unsubscribe = appStore.sub(authAtom, () => {
    void queryClient.cancelQueries();
    queryClient.clear();
    void router.invalidate();
});
if (import.meta.hot) import.meta.hot.dispose(unsubscribe);
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");
ReactDOM.createRoot(rootElement).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </StrictMode>
);
