import { createFileRoute, Link } from "@tanstack/react-router";
export const Route = createFileRoute("/forbidden")({
    component: () => (
        <section className="p-6 space-y-3">
            <h1>Access denied</h1>
            <p>Your account does not have permission to view this page.</p>
            <Link to="/">Home</Link>
        </section>
    ),
});
