import { describe, expect, it } from "vite-plus/test";

import { resolveTheme } from "./initial-theme";

describe("initial theme", () => {
	it.each([
		["dark", "light", "dark"],
		["light", "dark", "light"],
		[undefined, "dark", "dark"],
		[undefined, "light", "light"],
		[undefined, undefined, "light"],
		["invalid", "dark", "dark"],
	] as const)("resolves cookie %s and browser hint %s to %s", (saved, hint, expected) => {
		expect(resolveTheme(saved, hint)).toBe(expected);
	});
});
