import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { renderToReadableStream, renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vite-plus/test";

import { getRouter } from "./router";
import { getInitialTheme } from "./server/initial-theme";
import { getInitialPresentationState } from "./stores/slide-search";

// Vitest does not emit CSS assets, so provide the URL expected by the document head.
vi.mock("./styles.css?url", () => ({ default: "/assets/styles.css" }));

// Test the loader payload without the server-function transport/compiler plugin.
vi.mock("@/server/initial-presentation", () => ({
	getInitialPresentation: ({ data }: { data: string }) => Promise.resolve(getInitialPresentationState(data)),
}));

vi.mock("@/server/initial-theme", () => ({
	getInitialTheme: vi.fn(() => Promise.resolve("light")),
}));

async function renderRouter(router: ReturnType<typeof getRouter>) {
	const stream = await renderToReadableStream(<RouterProvider router={router} />);
	await stream.allReady;
	return new Response(stream).text();
}

async function loadRouter(url: string) {
	const router = getRouter();
	router.update({ history: createMemoryHistory({ initialEntries: [url] }) });
	await router.load();
	return router;
}

describe("slide route search", () => {
	it("shows the spinner and navigation while a slide loads", async () => {
		const router = await loadRouter("/?slide=what-is-pgtest");
		const pendingHtml = renderToString(<RouterProvider router={router} />);
		expect(pendingHtml).toContain('role="status" aria-label="Loading slide"');
		expect(pendingHtml).toContain('aria-label="Slide navigation"');

		const html = await renderRouter(router);
		expect(html).toContain("What is PgTest?");
		// A streamed response can retain the fallback followed by its replacement script.
		const settledHtml = renderToString(<RouterProvider router={router} />);
		expect(settledHtml).not.toContain('aria-label="Loading slide"');
	});

	it.each(["light", "dark"] as const)("server-renders the %s theme", async (theme) => {
		vi.mocked(getInitialTheme).mockResolvedValueOnce(theme);
		const router = await loadRouter("/?slide=title");
		const html = await renderRouter(router);
		if (theme === "dark") expect(html).toContain('class="dark"');
		else expect(html).not.toContain('<html lang="en" class="dark"');
		expect(html).toContain(theme === "dark" ? "lucide-sun" : "lucide-moon");
	});

	it("server-renders the requested slide with its initial subslide", async () => {
		const router = await loadRouter("/?slide=table-of-contents");
		const html = await renderRouter(router);
		expect(html).toContain('aria-label="Table of contents"');
		expect(html).toContain("What is PgTest?");
		expect(html).not.toContain("Why am I building it?");
		expect(html).not.toContain("<footer");
		expect(html).toContain('aria-label="Slide navigation"');
	});

	it.each([
		{ id: "reasons-for-building-pgtest", content: "Isolating tests with transactions" },
		{ id: "title", content: "" },
	])("renders $id with slide navigation and no footer", async ({ id, content }) => {
		const router = await loadRouter(`/?slide=${id}`);
		const html = await renderRouter(router);
		expect(html).toContain(content);
		expect(html).not.toContain("<footer");
		expect(html).toContain('aria-label="Slide navigation"');
	});

	it("server-renders the architecture divider with only its title", async () => {
		const router = await loadRouter("/?slide=architecture-and-implementation");
		const html = await renderRouter(router);
		const section = html.match(/<section\b[^>]*>([\s\S]*?)<\/section>/)?.[1];
		expect(section).toBeDefined();
		expect(section?.replace(/<[^>]*>/g, "")).toBe("Architecture and implementation");
	});

	it("server-renders the transparency goal and initial PgTest diagram", async () => {
		const router = await loadRouter("/?slide=implementation-goals");
		const html = await renderRouter(router);
		expect(html).toMatch(/Implementation goals[\s\S]*<h2[^>]*>Transparent for the user<\/h2>/);
		expect(html).toContain('aria-label="PgTest"');
		expect(html).toContain('aria-label="Postgres Server"');
		expect(html).toContain('aria-label="PostgreSQL"');
		expect(html).not.toContain('aria-label="Database pool"');
		expect(html).not.toContain('aria-label="Test suite"');
	});

	it("opens the client connection slide with the subtitle before its title and no columns", async () => {
		const router = await loadRouter("/?slide=client-connection");
		const html = await renderRouter(router);
		expect(html).toContain("PoC Implementation");
		expect(html).toMatch(/PoC Implementation[\s\S]*<h2[^>]*>Client connection<\/h2>/);
		expect(html).not.toContain("Extra roundtrips");
		expect(html).not.toContain("generate unique IDs");
		expect(html).not.toContain('aria-label="IntegreSQL"');
		expect(html).not.toContain('aria-label="PgTest"');
	});

	it("opens the database pool slide with only its subtitle and title", async () => {
		const router = await loadRouter("/?slide=database-pool-strategy");
		const html = await renderRouter(router);
		expect(html).toMatch(/PoC Implementation[\s\S]*<h2[^>]*>Database Pool Strategy<\/h2>/);
		expect(html).not.toContain('aria-label="IntegreSQL"');
		expect(html).not.toContain('aria-label="PgTest"');
		expect(html).not.toContain("animation placeholder");
	});

	it("opens cleanup database trigger with its subtitle before the title and no columns", async () => {
		const router = await loadRouter("/?slide=cleanup-database-trigger");
		const html = await renderRouter(router);
		expect(html).toMatch(/PoC Implementation[\s\S]*<h2[^>]*>Cleanup database trigger<\/h2>/);
		expect(html).not.toContain('aria-label="IntegreSQL"');
		expect(html).not.toContain('aria-label="PgTest"');
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
		expect(await renderRouter(first)).toContain('aria-label="Table of contents"');
	});
});
