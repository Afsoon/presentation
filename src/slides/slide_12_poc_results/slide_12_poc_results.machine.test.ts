import { describe, expect, it } from "vite-plus/test";
import { createActor } from "xstate";

import { createSubslideControlsStore } from "@/stores/subslide-controls";

import { pocResultsMachine } from "./slide_12_poc_results.machine";

describe("PoC results machine", () => {
	it("traverses all four subslides in both directions", () => {
		const actor = createActor(pocResultsMachine).start();
		const states = ["poolStarvation", "connectionContention", "slotStates", "cleanupReliability"];
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
		expect(actor.getSnapshot().value).toBe("poolStarvation");
		actor.stop();
	});

	it("accepts navigation through the subslide controls store", () => {
		const store = createSubslideControlsStore();
		const actor = createActor(pocResultsMachine, { id: "poc-results" }).start();
		const unregister = store.registerActor(actor);
		store.getActor("poc-results")?.send({ type: "NEXT" });
		expect(actor.getSnapshot().value).toBe("connectionContention");
		unregister();
		expect(store.getActor("poc-results")).toBeUndefined();
		actor.stop();
	});
});
