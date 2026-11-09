import { describe, expect, it } from "vite-plus/test";
import { createActor } from "xstate";

import { createSubslideControlsStore } from "@/stores/subslide-controls";

import { v01ResultsMachine } from "./slide_17_v0_1_results.machine";

describe("v0.1 results machine", () => {
	it("traverses all four subslides in both directions", () => {
		const actor = createActor(v01ResultsMachine).start();
		const states = ["batchReplenishment", "fewerStates", "speedAndReliability", "releaseReady"];
		expect(actor.getSnapshot().can({ type: "PREVIOUS" })).toBe(false);
		actor.send({ type: "PREVIOUS" });
		for (const state of states) {
			expect(actor.getSnapshot().value).toBe(state);
			expect(actor.getSnapshot().context).toEqual({});
			actor.send({ type: "NEXT" });
		}
		expect(actor.getSnapshot().can({ type: "NEXT" })).toBe(false);
		for (const state of [...states].reverse()) {
			expect(actor.getSnapshot().value).toBe(state);
			actor.send({ type: "PREVIOUS" });
		}
		expect(actor.getSnapshot().value).toBe("batchReplenishment");
		actor.stop();
	});

	it("accepts navigation through the subslide controls store", () => {
		const store = createSubslideControlsStore();
		const actor = createActor(v01ResultsMachine, { id: "v0-1-results" }).start();
		const unregister = store.registerActor(actor);
		store.getActor("v0-1-results")?.send({ type: "NEXT" });
		expect(actor.getSnapshot().value).toBe("fewerStates");
		unregister();
		expect(store.getActor("v0-1-results")).toBeUndefined();
		actor.stop();
	});
});
