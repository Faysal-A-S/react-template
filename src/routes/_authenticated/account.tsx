import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/account")({
    component: AccountPage,
});
function AccountPage() {
    const { user } = useAuth();
    if (!user) return null;
    return (
        <section className="p-6 space-y-4">
            <h1 className="text-2xl font-semibold">{user.name}</h1>
            <p>{user.email}</p>
            <h2 className="font-medium">Roles</h2>
            <p>{user.roles.join(", ") || "None"}</p>
            <h2 className="font-medium">Permissions</h2>
            {user.permissions.length ? (
                <ul>
                    {user.permissions.map((permission) => (
                        <li key={permission}>{permission}</li>
                    ))}
                </ul>
            ) : (
                <p>None</p>
            )}
        </section>
    );
}
