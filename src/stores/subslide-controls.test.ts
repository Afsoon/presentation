import { describe, expect, it, vi } from "vite-plus/test";

import { createSubslideControlsStore, getAvailableSubslideControls } from "./subslide-controls";

const slide = { Id: "contents", name: "Contents", hasSubslides: true };

describe("subslide controls", () => {
	it("updates and clears button controls while keeping the server snapshot empty", () => {
		const store = createSubslideControlsStore();
		const listener = vi.fn();
		const unsubscribe = store.subscribe(listener);
		const first = { Id: slide.Id, up: null, down: vi.fn() };
		expect(store.getSnapshot()).toBeNull();
		store.updateSubslidesControl(first);
		expect(store.getSnapshot()).toEqual({ ...first, canGoUp: false, canGoDown: true });
		expect(store.getServerSnapshot()).toBeNull();
		const last = { Id: slide.Id, up: vi.fn(), down: null };
		store.updateSubslidesControl(last);
		expect(store.getSnapshot()).toEqual({ ...last, canGoUp: true, canGoDown: false });
		expect(first.down).not.toHaveBeenCalled();
		expect(last.up).not.toHaveBeenCalled();
		store.updateSubslidesControl(null);
		expect(store.getSnapshot()).toBeNull();
		expect(listener).toHaveBeenCalledTimes(3);
		unsubscribe();
		store.updateSubslidesControl(first);
		expect(listener).toHaveBeenCalledTimes(3);
	});

	it("only exposes controls belonging to the current slide with subslides", () => {
		const controls = { Id: slide.Id, up: null, down: vi.fn() };
		expect(getAvailableSubslideControls(controls, slide)).toBe(controls);
		expect(getAvailableSubslideControls(null, slide)).toBeNull();
		expect(getAvailableSubslideControls(controls, { ...slide, Id: "other" })).toBeNull();
		expect(getAvailableSubslideControls(controls, { ...slide, hasSubslides: false })).toBeNull();
	});
});
