import type { Session } from "./auth-types";

function stringList(value: unknown): string[] {
    if (value === undefined) return [];
    if (
        !Array.isArray(value) ||
        !value.every((item) => typeof item === "string")
    ) {
        throw new Error("Invalid roles or permissions in auth response.");
    }
    return [...new Set(value as string[])];
}

// Both POST /auth/login and GET /auth/me return { data: { user: ... } }.
// Explicitly select user fields: ignore any tokens included in the response.
export function mapLoginResponse(value: unknown): Session {
    if (!value || typeof value !== "object" || !("data" in value)) {
        throw new Error("Invalid auth response.");
    }
    const data = value.data;
    if (!data || typeof data !== "object" || !("user" in data)) {
        throw new Error("Invalid auth response.");
    }
    const user = data.user;
    if (!user || typeof user !== "object")
        throw new Error("Invalid auth user.");
    const raw = user as Record<string, unknown>;
    if (
        typeof raw.id !== "number" ||
        !Number.isFinite(raw.id) ||
        typeof raw.name !== "string" ||
        typeof raw.email !== "string"
    ) {
        throw new Error("Invalid auth user.");
    }
    return {
        id: raw.id,
        name: raw.name,
        email: raw.email,
        roles: stringList(raw.roles),
        permissions: stringList(raw.permissions),
    };
}
