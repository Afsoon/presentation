import { describe, expect, it } from "vite-plus/test";
import { createActor } from "xstate";

import { createSubslideControlsStore } from "@/stores/subslide-controls";

import { goals } from "./slide_7_implementation_goals.data";
import { implementationGoalsMachine, selectVisibleGoals } from "./slide_7_implementation_goals.machine";

describe("implementation goals machine", () => {
	it("reveals and hides complete requirement/solution cards in order", () => {
		const actor = createActor(implementationGoalsMachine).start();
		const states = ["performance", "parallelTestSuites", "transparency", "tuning"];
		expect(actor.getSnapshot().can({ type: "PREVIOUS" })).toBe(false);
		actor.send({ type: "PREVIOUS" });
		for (let index = 0; index < states.length; index++) {
			expect(actor.getSnapshot().value).toBe(states[index]);
			expect(selectVisibleGoals(actor.getSnapshot())).toEqual(goals.slice(0, index + 1));
			expect(actor.getSnapshot().context).toEqual({});
			actor.send({ type: "NEXT" });
		}
		expect(actor.getSnapshot().can({ type: "NEXT" })).toBe(false);
		for (let index = states.length - 1; index >= 0; index--) {
			expect(actor.getSnapshot().value).toBe(states[index]);
			expect(selectVisibleGoals(actor.getSnapshot())).toEqual(goals.slice(0, index + 1));
			actor.send({ type: "PREVIOUS" });
		}
		expect(actor.getSnapshot().value).toBe("performance");
		actor.stop();
	});

	it("supports navigation through the registered slide actor", () => {
		const store = createSubslideControlsStore();
		const actor = createActor(implementationGoalsMachine, { id: "implementation-goals" }).start();
		const unregister = store.registerActor(actor);
		store.getActor("implementation-goals")?.send({ type: "NEXT" });
		expect(actor.getSnapshot().value).toBe("parallelTestSuites");
		unregister();
		expect(store.getActor("implementation-goals")).toBeUndefined();
		actor.stop();
	});
});
