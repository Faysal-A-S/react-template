import api from '@/lib/api';

import { authAtom } from '@/store';
import { useMutation } from '@tanstack/react-query';
import { useAtom } from 'jotai/react';
import { RESET } from 'jotai/utils';
// import { toast } from "sonner";
// import type { XiorError } from "xior";

// type LoginResponse = {
//   message: string;
//   user: undefined;
//   token: string;
// };

// export function useLogin() {
//   const [, setAuth] = useAtom(authAtom);

//   return useMutation<
//     LoginResponse,
//     XiorError<APIErrorResponse>,
//     LoginForm,
//     { toastId: number | string }
//   >({
//     mutationFn: async (data: LoginForm) => {
//       return await api.post("/login", data).then((response) => response.data);
//     },
//     onMutate: () => {
//       const toastId = toast.loading(m["login.logging in"](), {
//         description: m["login.logging in"](),
//       });
//       return {
//         toastId,
//       };
//     },
//     onSuccess: (data, _, context) => {
//       toast.success(m["login.logged in"](), { id: context.toastId });
//       setAuth({
//         user: data.user,
//         token: data.token,
//       });
//     },
//     onError: (error, _, context) => {
//       console.error("Login error:", error.response);
//       toast.error(m["login.login failed"](), {
//         id: context?.toastId,
//         description: error.response?.data.message,
//       });
//     },
//   });
// }

export function useLogout() {
	const [, setAuth] = useAtom(authAtom);

	return useMutation<void, Error>({
		mutationFn: async () => {
			return await api.post('/logout').then(response => response.data);
		},
		onMutate: () => {
			setAuth(RESET);
		},
		onError: error => {
			console.error('Logout error:', error);
		},
	});
}
