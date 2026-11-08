import { describe, expect, it, vi } from "vite-plus/test";
import { createActor } from "xstate";

import { tableOfContentsMachine } from "@/slides/slide_2_table_of_content/slide_2_table_of_content.machine";

import { createSlideStore } from "./slide-store";
import { createSubslideControlsStore } from "./subslide-controls";

describe("subslide controls store", () => {
	it("looks up the current slide actor by ID without sharing actors between stores", () => {
		const store = createSubslideControlsStore();
		const other = createSubslideControlsStore();
		const actor = createActor(tableOfContentsMachine, { id: "table-of-contents" }).start();
		const listener = vi.fn();
		const unsubscribe = store.subscribeActors(listener);
		const unregister = store.registerActor(actor);
		const slides = createSlideStore();
		slides.goToSlide("table-of-contents");
		expect(store.getActor(slides.getSnapshot().currentSlide.Id)).toBe(actor);
		store.getActor(slides.getSnapshot().currentSlide.Id)?.send({ type: "NEXT" });
		expect(actor.getSnapshot().value).toBe("whyBuildIt");
		expect(other.getActor(actor.id)).toBeUndefined();
		slides.goToSlide("title");
		expect(store.getActor(slides.getSnapshot().currentSlide.Id)).toBeUndefined();
		unregister();
		expect(store.getActor(actor.id)).toBeUndefined();
		expect(listener).toHaveBeenCalledTimes(2);
		unsubscribe();
		actor.stop();
	});

	it("does not remove a replacement actor when an older registration cleans up", () => {
		const store = createSubslideControlsStore();
		const first = createActor(tableOfContentsMachine, { id: "table-of-contents" });
		const second = createActor(tableOfContentsMachine, { id: "table-of-contents" });
		const removeFirst = store.registerActor(first);
		const removeSecond = store.registerActor(second);
		removeFirst();
		expect(store.getActor(second.id)).toBe(second);
		removeSecond();
		expect(store.getActor(second.id)).toBeUndefined();
	});
});
