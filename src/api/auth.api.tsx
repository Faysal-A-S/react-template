import { useMutation } from "@tanstack/react-query";
import { isXiorError } from "xior";
import { toast } from "sonner";
import { publicApi } from "@/lib/api";
import { mapLoginResponse } from "@/lib/auth-response";
import {
    getSession,
    getSessionVersion,
    isSessionInitialized,
    setSession,
} from "@/store";
import type { LoginCredentials, Session } from "@/lib/auth-types";

let pendingSession: Promise<Session | null> | null = null;

// Deduplicate initial route loads. Only a 401 means signed out; network/server
// failures reach the route error screen and can be retried.
export function restoreSession(): Promise<Session | null> {
    if (isSessionInitialized()) return Promise.resolve(getSession());
    if (pendingSession) return pendingSession;
    const version = getSessionVersion();
    pendingSession = publicApi
        .get<unknown>("/auth/me")
        .then((response) => mapLoginResponse(response.data))
        .catch((error: unknown) => {
            if (isXiorError(error) && error.response?.status === 401)
                return null;
            throw error;
        })
        .then((session) => {
            if (version === getSessionVersion()) setSession(session);
            return getSession();
        })
        .finally(() => {
            pendingSession = null;
        });
    return pendingSession;
}

export async function login(payload: LoginCredentials) {
    const response = await publicApi.post<unknown>("/auth/login", payload);
    const session = mapLoginResponse(response.data);
    setSession(session);
    return session;
}

export async function logout() {
    await publicApi.post("/auth/logout");
    setSession(null);
}

export function useLogin() {
    return useMutation({
        mutationKey: ["login"],
        mutationFn: login,
        onSuccess() {
            toast.success("Signed in successfully.");
        },
    });
}

export function useLogout() {
    return useMutation({
        mutationKey: ["logout"],
        // Preserve the UI session if the server cannot clear its cookie.
        mutationFn: logout,
        onError() {
            toast.error("Could not sign out. Please try again.");
        },
    });
}
