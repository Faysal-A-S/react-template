import { isXiorError } from "xior";
export function authErrorMessage(error: unknown): string {
    if (isXiorError(error)) {
        const status = error.response?.status;
        if (status === 401)
            return "Your session has expired or the email/password is incorrect.";
        if (status === 403) return "The server denied this request.";
        if (status === 404)
            return "The authentication endpoint was not found. Check the API base URL and /auth endpoints.";
        if (!status)
            return "Cannot connect to the authentication server. Check the API URL, network, and credentialed CORS settings.";
        return `Authentication request failed (HTTP ${status}). Please try again.`;
    }
    return error instanceof Error
        ? error.message
        : "Unable to verify your session.";
}
