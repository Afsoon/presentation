import { describe, expect, it, vi } from "vite-plus/test";

import { createSlideStore } from "./slide-store";

const slides = [
	{ id: "first", name: "First slide", position: 0 },
	{ id: "second", name: "Second slide", position: 1 },
	{ id: "third", name: "Third slide", position: 2 },
];

describe("slide store", () => {
	it("exposes ordered metadata, names, and navigation targets without components", () => {
		const store = createSlideStore({ slides, currentPosition: 1 });
		const snapshot = store.getSnapshot();

		expect(snapshot.slides.map((slide) => [slide.position, slide.name])).toEqual([
			[0, "First slide"],
			[1, "Second slide"],
			[2, "Third slide"],
		]);
		expect(snapshot.currentSlide).toEqual({ id: "second", name: "Second slide", position: 1 });
		expect(snapshot.availableNavigations.left).toBe(snapshot.slides[0]);
		expect(snapshot.availableNavigations.right).toBe(snapshot.slides[2]);
		expect(JSON.parse(JSON.stringify(snapshot))).toEqual(snapshot);
	});

	it("navigates in both directions and leaves boundary requests unchanged", () => {
		const store = createSlideStore({ slides, currentPosition: 0 });
		const first = store.getSnapshot();
		store.navigate("left");
		expect(store.getSnapshot()).toBe(first);
		expect(first.availableNavigations.left).toBeNull();

		store.navigate("right");
		expect(store.getSnapshot()).toMatchObject({ currentPosition: 1, direction: "right", transitionClass: "slide-in" });
		store.navigate("right");
		const last = store.getSnapshot();
		expect(last.currentSlide.id).toBe("third");
		expect(last.availableNavigations.right).toBeNull();
		store.navigate("right");
		expect(store.getSnapshot()).toBe(last);

		store.navigate("left");
		expect(store.getSnapshot()).toMatchObject({ currentPosition: 1, direction: "left", transitionClass: "slide-back" });
		store.navigate("left");
		expect(store.getSnapshot().currentSlide.id).toBe("first");
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
		const input = [{ id: "only", name: "Original name", position: 0 }];
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
