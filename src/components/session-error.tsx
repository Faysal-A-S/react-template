import {
    Link,
    useRouter,
    type ErrorComponentProps,
} from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { authErrorMessage } from "@/lib/auth-error";

export function SessionError({ error, reset }: ErrorComponentProps) {
    const router = useRouter();
    return (
        <section className="p-6 space-y-4">
            <h1 className="text-xl font-semibold">
                Unable to verify your session
            </h1>
            <p role="alert">{authErrorMessage(error)}</p>
            <div className="flex gap-3">
                <Button onClick={() => void router.invalidate().then(reset)}>
                    Try again
                </Button>
                <Link to="/login" search={{ redirect: "/account" }}>
                    Sign in
                </Link>
                <Link to="/">Home</Link>
            </div>
        </section>
    );
}
