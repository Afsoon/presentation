import { createServerFn } from "@tanstack/react-start";
import { getCookie, getRequestHeader, setResponseHeader } from "@tanstack/react-start/server";

export function resolveTheme(savedTheme: string | undefined, colorScheme: string | undefined): "light" | "dark" {
	if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
	return colorScheme === "dark" ? "dark" : "light";
}

export const getInitialTheme = createServerFn({ method: "GET" }).handler(() => {
	setResponseHeader("Accept-CH", "Sec-CH-Prefers-Color-Scheme");
	setResponseHeader("Vary", "Cookie, Sec-CH-Prefers-Color-Scheme");
	return resolveTheme(getCookie("theme"), getRequestHeader("sec-ch-prefers-color-scheme"));
});
