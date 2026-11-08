import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, lazyPlugins } from "vite-plus";

const config = defineConfig(({ mode }) => ({
	staged: {
		"*": "vp check --fix",
	},
	fmt: {
		printWidth: 120,
		useTabs: true,
		sortImports: true,
	},
	lint: {
		jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
		rules: { "vite-plus/prefer-vite-plus-imports": "error" },
		options: { typeAware: true, typeCheck: true },
	},
	resolve: { tsconfigPaths: true },
	// Store unit tests run in Node without starting the app's Cloudflare runtime.
	plugins: lazyPlugins(() =>
		mode === "test"
			? []
			: [devtools(), cloudflare({ viteEnvironment: { name: "ssr" } }), tailwindcss(), tanstackStart(), viteReact()],
	),
}));

export default config;
