import { redirect } from "@tanstack/react-router";
import { getSession } from "@/store";
import { canAccess } from "./permissions";
import type { AccessRules } from "./auth-types";

// Extend this allowlist when adding protected destinations.
export function safeRedirect(path: unknown): "/account" | "/customers" {
    return path === "/customers" ? "/customers" : "/account";
}

// The _authenticated layout restores the session before child guards run.
export function requireAuth(path = "/account") {
    const user = getSession();
    if (!user)
        throw redirect({
            to: "/login",
            search: { redirect: safeRedirect(path) },
        });
    return user;
}

export function requireAccess(rules: AccessRules, path = "/account") {
    const user = requireAuth(path);
    if (!canAccess(user, rules)) throw redirect({ to: "/forbidden" });
    return user;
}

export function requireRole(...roles: string[]) {
    return requireAccess({ roles });
}
export function requireAllPermissions(...permissions: string[]) {
    return requireAccess({ permissions });
}
export function requireAnyPermission(...permissions: string[]) {
    return requireAccess({ permissions, mode: "any" });
}
