# React Starter

React, TypeScript, Vite, TanStack Router/Query, Jotai, Tailwind, shadcn/ui, React Hook Form, Valibot, and Paraglide. Authentication uses backend-issued HttpOnly cookies and exact backend role/permission names.

## Run

Use Node 22.13+, 24, or 26+ (see `engines` in package.json), and Bun 1.3.14+.

```sh
bun install --frozen-lockfile
bun run dev
```

- `bun run test`: auth, HTTP transport, route, and component guard tests
- `bun run lint`: ESLint
- `bun run typecheck`: TypeScript
- `bun run build`: generate routes/translations, build, then typecheck
- `bun run check`: tests, lint, and production build

The committed Bun lockfile pins the tested dependencies. See [dependency updates](DEPENDENCY_UPDATES.md) for versions and compatibility notes.

## Authentication setup

`API_BASE_URL` in `src/lib/api.ts` uses the optional `VITE_API_BASE_URL` setting, falling back to `/api` on the same origin. Configure an actual backend URL including `/api`, or arrange a same-origin `/api` reverse proxy. The starter includes no backend or simulated credentials.

Required backend endpoints:

| Endpoint            | Contract                                            |
| ------------------- | --------------------------------------------------- |
| `POST /auth/login`  | JSON `{ email, password }`; sets HttpOnly cookies   |
| `GET /auth/me`      | Returns the current user, or HTTP 401 if signed out |
| `POST /auth/logout` | Revokes the session and expires cookies             |

Login and `/auth/me` return:

```json
{
    "data": {
        "user": {
            "id": 1,
            "name": "Alex",
            "email": "alex@example.com",
            "roles": ["staff.standard"],
            "permissions": [
                "customer.view_list",
                "customer.create",
                "brand.view_list"
            ]
        }
    }
}
```

All permission and role names come from the backend. New names need no frontend enum. Missing role/permission arrays grant no access; malformed arrays reject the response. Tokens returned alongside the user are ignored.

Both xior clients send `credentials: 'include'`. No bearer tokens or auth data are saved in localStorage. HttpOnly cookies are set and cleared by the server, never JavaScript. The backend must configure HttpOnly/Secure/SameSite cookies, credentialed CORS for the frontend origin, CSRF protection, and endpoint authorization.

Only the `_authenticated` route layout waits for `/auth/me`. Public home and login remain available when the backend is down. Protected routes show a specific retryable error for network/404/server failures; a 401 redirects to login. Login errors stay inline in the form. Use Account to resume an existing cookie session after reloading a public page.

Protected API 401 responses clear the user and query cache and rerun route guards; 403 responses preserve the session. Requests from an old session cannot clear a newer login. Logout waits for successful server revocation; failures leave the user signed in with a retryable error. There is no automatic refresh-token flow: an expired access session requires sign-in. Other tabs notice expiry on reload or a subsequent unauthorized API request.

## Simple structure

```text
src/
  api/auth.api.tsx          # Login, logout, deduplicated session restoration
  store/index.ts           # In-memory Jotai user state
  lib/api.ts               # Cookie-based xior clients
  lib/auth-types.ts        # User and access types
  lib/auth-response.ts     # Runtime response validation
  lib/auth-guards.ts       # Route authorization and redirect allowlist
  lib/permissions.ts       # Shared access predicate
  lib/auth-error.ts        # User-facing authentication errors
  lib/query-client.ts      # Shared QueryClient
  hooks/use-auth.ts        # User and permission helpers
  components/permission-guard.tsx
  components/session-error.tsx
  routes/
    __root.tsx             # Public layout, navigation
    login.tsx              # Email/password form
    forbidden.tsx          # Access-denied page
    _authenticated/
      route.tsx            # Restores cookie session before child guards
      account.tsx          # Current user and granted permission names
      customers.tsx        # Example permission-protected page
```

The customer page demonstrates access control; it is not a customer CRUD implementation. Existing form/UI components and localization remain in place.

## Protect a route

Put protected pages under `src/routes/_authenticated/`:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { requireAllPermissions } from "@/lib/auth-guards";

export const Route = createFileRoute("/_authenticated/brands")({
    beforeLoad: () => {
        requireAllPermissions("brand.view_list");
    },
    component: BrandsPage,
});
```

Available guards: `requireAuth`, `requireAccess`, `requireRole`, `requireAnyPermission`, and `requireAllPermissions`. The parent authenticated layout restores the session before child guards run. A signed-out user goes to `/login`; a signed-in user without access goes to `/forbidden`. Extend `safeRedirect`'s internal allowlist for new destinations to preserve their post-login return path.

## Protect UI

```tsx
import { PermissionGuard } from '@/components/permission-guard'

<PermissionGuard permissions={['customer.create']}>
  <Button onClick={openCustomerForm}>Add customer</Button>
</PermissionGuard>

<PermissionGuard
  permissions={['brand.create', 'brand.update']}
  mode="any"
  fallback={<p>Read-only access</p>}
>
  <BrandEditor />
</PermissionGuard>
```

Permissions default to `all`; `mode="any"` accepts any listed permission. Optional `roles` accepts any listed role. When both roles and permissions are supplied, both checks must pass. There is no implicit admin bypass.

```tsx
const {
    user,
    isAuthenticated,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasAnyRole,
    can,
} = useAuth();
const canDelete = hasPermission("customer.delete");
const canManage = can({
    roles: ["super_admin.manager"],
    permissions: ["staff.update"],
});
```

These controls govern UI visibility and navigation. The backend must enforce the same permissions on every protected endpoint.

## API and deployment

Use `api` from `@/lib/api` for protected requests and `publicApi` for auth endpoints. Pass `FormData` directly for uploads; the client removes Content-Type so the browser supplies the boundary. Cookie requests are restricted to the configured API origin.

Build and deploy `dist/` with an SPA fallback to `/index.html`. Paraglide's configured plugins may need network access during the first build. Regenerate `src/routeTree.gen.ts` through Vite when adding routes; do not edit it by hand.
