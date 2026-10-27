import { atom, getDefaultStore } from "jotai";
import type { Session } from "@/lib/auth-types";

export const appStore = getDefaultStore();
const state = atom<Session | null>(null);
export const authAtom = atom((get) => get(state));
let initialized = false;
let version = 0;
export const getSession = () => appStore.get(authAtom);
export const getSessionVersion = () => version;
export const isSessionInitialized = () => initialized;
export function setSession(user: Session | null) {
    initialized = true;
    version++;
    appStore.set(state, user);
}
