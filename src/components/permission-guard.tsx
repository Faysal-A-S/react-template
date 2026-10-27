import type { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import type { AccessRules } from "@/lib/auth-types";

type PermissionGuardProps = AccessRules & {
    children: ReactNode;
    fallback?: ReactNode;
};

export function PermissionGuard({
    children,
    fallback = null,
    ...rules
}: PermissionGuardProps) {
    const { can } = useAuth();
    return <>{can(rules) ? children : fallback}</>;
}
