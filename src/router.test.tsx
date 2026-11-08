import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vite-plus/test";

import { getRouter } from "./router";
import { getInitialPresentationState } from "./stores/slide-search";

// Test the loader payload without the server-function transport/compiler plugin.
vi.mock("@/server/initial-presentation", () => ({
	getInitialPresentation: ({ data }: { data: string }) => Promise.resolve(getInitialPresentationState(data)),
}));

async function loadRouter(url: string) {
	const router = getRouter();
	router.update({ history: createMemoryHistory({ initialEntries: [url] }) });
	await router.load();
	return router;
}

describe("slide route search", () => {
	it("server-renders the requested slide with its initial subslide", async () => {
		const router = await loadRouter("/?slide=table-of-contents");
		const html = renderToString(<RouterProvider router={router} />);
		expect(html).toContain('aria-label="Table of contents"');
		expect(html).toContain("What is PgTest?");
		expect(html).not.toContain("Why am I building it?");
		const buttons = html.match(/<button\b[^>]*>[\s\S]*?<\/button>/g) ?? [];
		expect(buttons.find((button) => button.includes("Go to previous subslide"))).toContain('disabled=""');
		expect(buttons.find((button) => button.includes("Go to next subslide"))).not.toContain('disabled=""');
		// Firefox must not restore a previous disabled state before React hydrates.
		const navigationButtons = buttons.filter((button) => /Go to (previous|next) (subslide|slide)/.test(button));
		expect(navigationButtons).toHaveLength(4);
		for (const button of navigationButtons) expect(button).toContain('autoComplete="off"');
	});

	it("initializes isolated server requests from their URLs", async () => {
		const [first, second] = await Promise.all([
			loadRouter("/?slide=table-of-contents"),
			loadRouter("/?slide=reasons-for-building-pgtest"),
		]);
		const firstData = first.state.matches.at(-1)?.loaderData as ReturnType<typeof getInitialPresentationState>;
		const secondData = second.state.matches.at(-1)?.loaderData as ReturnType<typeof getInitialPresentationState>;
		expect(firstData.slide.currentSlide.Id).toBe("table-of-contents");
		expect(secondData.slide.currentSlide.Id).toBe("reasons-for-building-pgtest");
		expect(firstData.subslideControls).toMatchObject({ canGoUp: false, canGoDown: true });
		expect(renderToString(<RouterProvider router={first} />)).toContain('aria-label="Table of contents"');
	});
});
