import { describe, expect, it } from "vite-plus/test";
import { createActor } from "xstate";

import { createSubslideControlsStore } from "@/stores/subslide-controls";

import { resultsMachine } from "./slide_22_results.machine";

describe("results subslides", () => {
	it("opens on the results and navigates to the diagram recap and back", () => {
		const actor = createActor(resultsMachine, { id: "results" }).start();
		const store = createSubslideControlsStore();
		const unregister = store.registerActor(actor);
		expect(actor.getSnapshot().value).toBe("results");
		expect(actor.getSnapshot().can({ type: "PREVIOUS" })).toBe(false);
		store.getActor("results")?.send({ type: "NEXT" });
		expect(actor.getSnapshot().value).toBe("recap");
		expect(actor.getSnapshot().can({ type: "NEXT" })).toBe(false);
		store.getActor("results")?.send({ type: "PREVIOUS" });
		expect(actor.getSnapshot().value).toBe("results");
		unregister();
		expect(store.getActor("results")).toBeUndefined();
		actor.stop();
	});
});
