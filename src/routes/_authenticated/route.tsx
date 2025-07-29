import { authAtom } from "@/store";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useAtom } from "jotai/react";

export const Route = createFileRoute("/_authenticated")({
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	const [auth] = useAtom(authAtom);

	if (!auth) {
		return <Navigate to="/login" reloadDocument />;
	}

	return <Outlet />;
}
