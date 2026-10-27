import type { AccessRules, Session } from "./auth-types";

// Exact backend keys, e.g. customer.view_list, brand.create, staff.update.
// No admin bypass and no inferred permissions from a role name.
export function canAccess(
    session: Session | null,
    rules: AccessRules = {}
): boolean {
    if (!session) return false;
    if (
        rules.roles?.length &&
        !rules.roles.some((role) => session.roles.includes(role))
    ) {
        return false;
    }
    const permissions = rules.permissions ?? [];
    if (!permissions.length) return true;
    return rules.mode === "any"
        ? permissions.some((permission) =>
              session.permissions.includes(permission)
          )
        : permissions.every((permission) =>
              session.permissions.includes(permission)
          );
}
