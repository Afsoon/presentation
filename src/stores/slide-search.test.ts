import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { getInitialPresentationState, validateSlideSearch } from "./slide-search";
import { createSlideStore } from "./slide-store";

afterEach(() => vi.unstubAllGlobals());

function mockBrowser(href: string) {
	const location = { href };
	const history = {
		state: { key: "existing-history-state" },
		replaceState: vi.fn((_state: unknown, _title: string, url: URL) => {
			location.href = url.toString();
		}),
	};
	vi.stubGlobal("window", { location, history });
	return { location, history };
}

describe("slide URL initialization", () => {
	it("provides serializable initial controls for every slide", () => {
		for (const slide of getInitialPresentationState("").slide.slides) {
			const initial = getInitialPresentationState(`?slide=${slide.Id}`);
			expect(initial.subslideControls).toEqual({
				Id: slide.Id,
				canGoUp: false,
				canGoDown: slide.hasSubslides,
				up: null,
				down: null,
			});
			expect(JSON.parse(JSON.stringify(initial))).toEqual(initial);
		}
	});

	it("replaces the URL directly while preserving other parameters, hash, and history state", () => {
		const browser = mockBrowser("https://example.test/?slide=title&theme=dark#notes");
		const store = createSlideStore();
		store.hydrate(getInitialPresentationState("?slide=title").slide);
		store.navigate("right");
		expect(browser.location.href).toBe("https://example.test/?slide=table-of-contents&theme=dark#notes");
		expect(browser.history.replaceState).toHaveBeenCalledExactlyOnceWith(
			browser.history.state,
			"",
			new URL(browser.location.href),
		);
		store.goToSlide("table-of-contents");
		expect(browser.history.replaceState).toHaveBeenCalledTimes(1);
	});

	it("reads the current URL when a client store is recreated during HMR", () => {
		mockBrowser("https://example.test/?slide=reasons-for-building-pgtest");
		const initial = getInitialPresentationState("?slide=title");
		const store = createSlideStore();
		store.hydrate(initial.slide);
		expect(store.getSnapshot().currentSlide.Id).toBe("reasons-for-building-pgtest");
		expect(store.getSnapshot().direction).toBeNull();
		expect(store.getServerSnapshot()).toBe(initial.slide);
	});
	it.each([undefined, "unknown", 3, ["what-is-pgtest"], null])("defaults invalid IDs (%j) to the title", (slide) => {
		expect(validateSlideSearch({ slide })).toEqual({ slide: "title" });
	});

	it("accepts metadata IDs", () => {
		expect(validateSlideSearch({ slide: "what-is-pgtest" })).toEqual({ slide: "what-is-pgtest" });
	});

	it("initializes matching server and client snapshots without a transition", () => {
		const server = createSlideStore();
		const client = createSlideStore();
		server.hydrate(getInitialPresentationState("?slide=reasons-for-building-pgtest").slide);
		client.hydrate(getInitialPresentationState("?slide=reasons-for-building-pgtest").slide);
		expect(server.getServerSnapshot()).toEqual(client.getServerSnapshot());
		expect(client.getSnapshot()).toBe(client.getServerSnapshot());
		expect(client.getSnapshot()).toMatchObject({ currentPosition: 4, direction: null });
	});

	it("keeps hydration stable and does not notify for the same ID", () => {
		const store = createSlideStore();
		store.hydrate(getInitialPresentationState("?slide=what-is-pgtest").slide);
		const hydration = store.getServerSnapshot();
		const listener = vi.fn();
		store.subscribe(listener);
		store.goToSlide("what-is-pgtest");
		expect(listener).not.toHaveBeenCalled();
		store.goToSlide("reasons-for-building-pgtest");
		expect(store.getSnapshot().direction).toBe("right");
		store.goToSlide("table-of-contents");
		expect(store.getSnapshot().direction).toBe("left");
		store.hydrate(getInitialPresentationState("?slide=title").slide);
		expect(store.getSnapshot().currentSlide.Id).toBe("table-of-contents");
		expect(store.getServerSnapshot()).toBe(hydration);
	});
});
