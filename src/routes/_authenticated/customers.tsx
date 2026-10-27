import { createFileRoute } from "@tanstack/react-router";
import { requireAllPermissions } from "@/lib/auth-guards";

export const Route = createFileRoute("/_authenticated/customers")({
    beforeLoad: () => {
        requireAllPermissions("customer.view_list");
    },
    component: () => (
        <section className="p-6 space-y-3">
            <h1 className="text-2xl font-semibold">Customers</h1>
            <p>This protected example page is ready for your customer list.</p>
        </section>
    ),
});
