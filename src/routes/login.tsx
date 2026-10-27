import { useState, type FormEvent } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useLogin } from "@/api/auth.api";
import { getSession } from "@/store";
import { safeRedirect } from "@/lib/auth-guards";
import { authErrorMessage } from "@/lib/auth-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
    validateSearch: (search: Record<string, unknown>) => ({
        redirect: safeRedirect(search.redirect),
    }),
    beforeLoad: ({ search }) => {
        if (getSession()) throw redirect({ to: search.redirect });
    },
    component: LoginPage,
});
function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const mutation = useLogin();
    const navigate = useNavigate();
    const search = Route.useSearch();
    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (mutation.isPending) return;
        try {
            await mutation.mutateAsync({ email: email.trim(), password });
        } catch {
            setPassword("");
            return;
        }
        setPassword("");
        await navigate({ to: search.redirect, replace: true });
    }
    return (
        <section className="mx-auto max-w-sm p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Sign in</h1>
            <form
                className="space-y-4"
                onSubmit={(event) => void submit(event)}
                aria-busy={mutation.isPending}
            >
                <fieldset disabled={mutation.isPending} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="username"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                        />
                    </div>
                </fieldset>
                {mutation.isError && (
                    <p role="alert" className="text-destructive">
                        {authErrorMessage(mutation.error)}
                    </p>
                )}
                <Button
                    type="submit"
                    disabled={mutation.isPending || !email.trim() || !password}
                >
                    {mutation.isPending ? "Signing in…" : "Sign in"}
                </Button>
            </form>
        </section>
    );
}
