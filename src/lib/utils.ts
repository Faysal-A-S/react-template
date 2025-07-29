import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function closeModal(modalId: string) {
	//Set default modal ID in the params
	document.getElementById(modalId)?.click();
}
