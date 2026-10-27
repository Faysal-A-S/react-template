import {
    createRootRoute,
    Link,
    Outlet,
    useNavigate,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { PermissionGuard } from "@/components/permission-guard";
import { useAuth } from "@/hooks/use-auth";
import { useLogout } from "@/api/auth.api";

export const Route = createRootRoute({ component: RootLayout });

function RootLayout() {
    const { user } = useAuth();
    const mutation = useLogout();
    const navigate = useNavigate();
    async function signOut() {
        try {
            await mutation.mutateAsync();
        } catch {
            return;
        }
        await navigate({ to: "/login", search: { redirect: "/account" } });
    }
    return (
        <>
            <nav
                aria-label="Main navigation"
                className="p-4 flex items-center gap-4 border-b"
            >
                <Link to="/">Home</Link>
                <Link to="/account">Account</Link>
                <PermissionGuard permissions={["customer.view_list"]}>
                    <Link to="/customers">Customers</Link>
                </PermissionGuard>
                {user ? (
                    <Button
                        variant="outline"
                        disabled={mutation.isPending}
                        onClick={() => void signOut()}
                    >
                        {mutation.isPending ? "Signing out…" : "Sign out"}
                    </Button>
                ) : (
                    <Link to="/login" search={{ redirect: "/account" }}>
                        Sign in
                    </Link>
                )}
            </nav>
            <Outlet />
            <Toaster />
        </>
    );
}
