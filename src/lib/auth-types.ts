// The backend supplies role and permission names; new names need no type changes.
export type Role = string;
export interface LoginCredentials {
    email: string;
    password: string;
}
export interface Session {
    id: number;
    name: string;
    email: string;
    roles: string[];
    permissions: string[];
}
export interface LoginResponse {
    data: { user: Session };
}
export interface AccessRules {
    roles?: readonly string[];
    permissions?: readonly string[];
    mode?: "any" | "all";
}
