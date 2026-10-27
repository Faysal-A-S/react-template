import { useAtomValue } from "jotai";
import { authAtom } from "@/store";
import { canAccess } from "@/lib/permissions";
import type { AccessRules } from "@/lib/auth-types";

export function useAuth() {
    const user = useAtomValue(authAtom);
    return {
        user,
        isAuthenticated: !!user,
        can: (rules: AccessRules) => canAccess(user, rules),
        hasPermission: (permission: string) =>
            canAccess(user, { permissions: [permission] }),
        hasAnyPermission: (...permissions: string[]) =>
            canAccess(user, { permissions, mode: "any" }),
        hasAllPermissions: (...permissions: string[]) =>
            canAccess(user, { permissions }),
        hasAnyRole: (...roles: string[]) => canAccess(user, { roles }),
    };
}
