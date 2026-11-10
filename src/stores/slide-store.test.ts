import { describe, expect, it, vi } from "vite-plus/test";

import { createSlideStore } from "./slide-store";

const slides = [
	{ Id: "first", name: "First slide", hasSubslides: false, position: 0 },
	{ Id: "second", name: "Second slide", hasSubslides: true, position: 1 },
	{ Id: "third", name: "Third slide", hasSubslides: false, position: 2 },
];

describe("slide store", () => {
	it("starts with the slides' exported metadata in presentation order", () => {
		const snapshot = createSlideStore().getSnapshot();

		expect(snapshot.slides).toEqual([
			{ Id: "title", name: "PgTest", hasSubslides: false, position: 0 },
			{ Id: "table-of-contents", name: "Table of contents", hasSubslides: true, position: 1 },
			{ Id: "what-is-pgtest", name: "What is pgtest?", hasSubslides: false, position: 2 },
			{ Id: "why-am-i-building-it", name: "Why am I building it?", hasSubslides: false, position: 3 },
			{ Id: "reasons-for-building-pgtest", name: "Reasons for building PgTest", hasSubslides: true, position: 4 },
			{
				Id: "architecture-and-implementation",
				name: "Architecture and implementation",
				hasSubslides: false,
				position: 5,
			},
			{ Id: "implementation-goals", name: "Implementation goals", hasSubslides: true, position: 6 },
			{
				Id: "proof-of-concept-implementation",
				name: "Proof of concept implementation",
				hasSubslides: false,
				position: 7,
			},
			{ Id: "client-connection", name: "Client connection", hasSubslides: true, position: 8 },
			{ Id: "database-pool-strategy", name: "Database Pool Strategy", hasSubslides: true, position: 9 },
			{ Id: "cleanup-database-trigger", name: "Cleanup database trigger", hasSubslides: true, position: 10 },
			{ Id: "poc-results", name: "PoC Results", hasSubslides: true, position: 11 },
			{ Id: "v0-1-implementation", name: "v0.1 implementation", hasSubslides: false, position: 12 },
			{ Id: "extract-io-from-manager", name: "Extract IO from manager and split it", hasSubslides: true, position: 13 },
			{ Id: "not-capping-the-pool", name: "Not capping the pool.", hasSubslides: true, position: 14 },
			{
				Id: "explicit-cleanup-database-command",
				name: "Explicit cleanup database command",
				hasSubslides: true,
				position: 15,
			},
			{ Id: "v0-1-results", name: "v0.1 Results", hasSubslides: true, position: 16 },
			{ Id: "v0-2-implementation", name: "v0.2 implementation", hasSubslides: false, position: 17 },
			{ Id: "changes-done-for-v0-2", name: "Changes done for v0.2", hasSubslides: true, position: 18 },
			{ Id: "conclusion", name: "Conclusion", hasSubslides: false, position: 19 },
			{ Id: "things-that-didnt-work", name: "Things that didn’t work", hasSubslides: true, position: 20 },
			{ Id: "results", name: "Results", hasSubslides: true, position: 21 },
			{ Id: "next-steps", name: "Next Steps", hasSubslides: true, position: 22 },
		]);
		expect(snapshot.currentSlide).toBe(snapshot.slides[0]);
	});

	it("exposes ordered metadata, names, and navigation targets without components", () => {
		const store = createSlideStore({ slides, currentPosition: 1 });
		const snapshot = store.getSnapshot();

		expect(snapshot.slides.map((slide) => [slide.position, slide.name])).toEqual([
			[0, "First slide"],
			[1, "Second slide"],
			[2, "Third slide"],
		]);
		expect(snapshot.currentSlide).toEqual({ Id: "second", name: "Second slide", hasSubslides: true, position: 1 });
		expect(snapshot.availableNavigations.left).toBe(snapshot.slides[0]);
		expect(snapshot.availableNavigations.right).toBe(snapshot.slides[2]);
		expect(JSON.parse(JSON.stringify(snapshot))).toEqual(snapshot);
	});

	it("navigates horizontally regardless of subslides and leaves boundary requests unchanged", () => {
		const store = createSlideStore({ slides, currentPosition: 0 });
		const first = store.getSnapshot();
		store.navigate("left");
		expect(store.getSnapshot()).toBe(first);
		expect(first.availableNavigations.left).toBeNull();

		store.navigate("right");
		expect(store.getSnapshot()).toMatchObject({ currentPosition: 1, direction: "right", transitionClass: "slide-in" });
		store.navigate("right");
		const last = store.getSnapshot();
		expect(last.currentSlide.Id).toBe("third");
		expect(last.availableNavigations.right).toBeNull();
		store.navigate("right");
		expect(store.getSnapshot()).toBe(last);

		store.navigate("left");
		expect(store.getSnapshot()).toMatchObject({ currentPosition: 1, direction: "left", transitionClass: "slide-back" });
		store.navigate("left");
		expect(store.getSnapshot().currentSlide.Id).toBe("first");
	});

	it("notifies subscribers only on changes and supports unsubscribing", () => {
		const store = createSlideStore({ slides, currentPosition: 0 });
		const listener = vi.fn(() => store.getSnapshot().currentPosition);
		const unsubscribe = store.subscribe(listener);

		store.navigate("left");
		expect(listener).not.toHaveBeenCalled();
		store.navigate("right");
		expect(listener).toHaveBeenCalledTimes(1);
		expect(listener).toHaveLastReturnedWith(1);
		unsubscribe();
		store.navigate("right");
		expect(listener).toHaveBeenCalledTimes(1);
	});

	it("caches snapshots and uses the supplied slides directly", () => {
		const input = [{ Id: "only", name: "Original name", hasSubslides: false, position: 0 }];
		const store = createSlideStore({ slides: input, currentPosition: 0 });
		const snapshot = store.getSnapshot();

		expect(store.getSnapshot()).toBe(snapshot);
		expect(snapshot.slides).toBe(input);
		expect(snapshot.currentSlide).toBe(input[0]);
		expect(snapshot.availableNavigations).toEqual({ left: null, right: null });
	});

	it("preserves the server snapshot and isolates separately seeded stores", () => {
		const first = createSlideStore({ slides, currentPosition: 1, direction: "left" });
		const second = createSlideStore({ slides, currentPosition: 0 });
		const serverSnapshot = first.getServerSnapshot();

		expect(first.getSnapshot()).toBe(serverSnapshot);
		first.navigate("right");
		expect(first.getServerSnapshot()).toBe(serverSnapshot);
		expect(serverSnapshot).toMatchObject({ currentPosition: 1, direction: "left" });
		expect(first.getSnapshot().currentPosition).toBe(2);
		expect(second.getSnapshot().currentPosition).toBe(0);
	});

	it("rejects invalid initial positions and ambiguous slide IDs", () => {
		for (const currentPosition of [-1, 0.5, 3, Number.NaN]) {
			expect(() => createSlideStore({ slides, currentPosition })).toThrow("initial slide position");
		}
		expect(() => createSlideStore({ slides: [], currentPosition: 0 })).toThrow("at least one slide");
		expect(() => createSlideStore({ slides: [slides[0], slides[0]], currentPosition: 0 })).toThrow("unique");
	});
});
