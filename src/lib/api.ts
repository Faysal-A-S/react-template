import xior from "xior";
// Set this to your backend API URL (including /api), or use the optional Vite setting.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
import { getSessionVersion, setSession } from "@/store";

const options = {
    baseURL: API_BASE_URL,
    timeout: 15_000,
    credentials: "include" as const,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
};

// Public auth calls also need credentials so the browser accepts Set-Cookie.
export const publicApi = xior.create(options);
const api = xior.create(options);
const requestVersions = new WeakMap<object, number>();

for (const client of [publicApi, api]) {
    client.interceptors.request.use((config) => {
        const base = new URL(API_BASE_URL, window.location.origin);
        const target = new URL(
            config.url ?? "",
            `${base.href.replace(/\/$/, "")}/`
        );
        if (target.origin !== base.origin) {
            throw new Error(
                "Use the configured API origin for credentialed requests."
            );
        }
        const headers = new Headers(config.headers);
        headers.delete("Authorization");
        if (config.data instanceof FormData) headers.delete("Content-Type");
        config.headers = Object.fromEntries(headers.entries());
        config.credentials = "include";
        requestVersions.set(config, getSessionVersion());
        return config;
    });
}

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response?.status === 401 &&
            error.config &&
            requestVersions.get(error.config) === getSessionVersion()
        ) {
            setSession(null);
        }
        return Promise.reject(error);
    }
);
export default api;
