import { describe, expect, it } from "vite-plus/test";
import { createActor } from "xstate";

import { createSubslideControlsStore } from "@/stores/subslide-controls";

import { goals, type ImplementationGoalStage } from "./slide_7_implementation_goals.data";
import { implementationGoalsMachine, selectImplementationGoal } from "./slide_7_implementation_goals.machine";

describe("implementation goals machine", () => {
	it("traverses all four cumulative diagram stages in both directions", () => {
		const actor = createActor(implementationGoalsMachine).start();
		const states: ImplementationGoalStage[] = ["transparency", "poolStrategy", "tuning", "performance"];
		expect(actor.getSnapshot().can({ type: "PREVIOUS" })).toBe(false);
		actor.send({ type: "PREVIOUS" });
		for (let index = 0; index < states.length; index++) {
			expect(actor.getSnapshot().value).toBe(states[index]);
			expect(selectImplementationGoal(actor.getSnapshot())).toEqual(goals[states[index]]);
			expect(actor.getSnapshot().context).toEqual({});
			actor.send({ type: "NEXT" });
		}
		expect(actor.getSnapshot().can({ type: "NEXT" })).toBe(false);
		for (let index = states.length - 1; index >= 0; index--) {
			expect(actor.getSnapshot().value).toBe(states[index]);
			expect(selectImplementationGoal(actor.getSnapshot())).toEqual(goals[states[index]]);
			actor.send({ type: "PREVIOUS" });
		}
		expect(actor.getSnapshot().value).toBe("transparency");
		actor.stop();
	});

	it("supports navigation through the registered slide actor", () => {
		const store = createSubslideControlsStore();
		const actor = createActor(implementationGoalsMachine, { id: "implementation-goals" }).start();
		const unregister = store.registerActor(actor);
		store.getActor("implementation-goals")?.send({ type: "NEXT" });
		expect(actor.getSnapshot().value).toBe("poolStrategy");
		unregister();
		expect(store.getActor("implementation-goals")).toBeUndefined();
		actor.stop();
	});
});
