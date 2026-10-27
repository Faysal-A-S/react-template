import { createFileRoute, Outlet } from "@tanstack/react-router";
import { restoreSession } from "@/api/auth.api";
import { requireAuth } from "@/lib/auth-guards";
import { SessionError } from "@/components/session-error";

export const Route = createFileRoute("/_authenticated")({
    beforeLoad: async ({ location }) => {
        await restoreSession();
        requireAuth(location.pathname);
    },
    pendingComponent: () => (
        <p role="status" className="p-6">
            Checking your session…
        </p>
    ),
    errorComponent: SessionError,
    component: Outlet,
});
