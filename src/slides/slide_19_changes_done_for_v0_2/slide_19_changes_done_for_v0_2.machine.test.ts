import { describe, expect, it } from "vite-plus/test";
import { createActor } from "xstate";

import { changes } from "./slide_19_changes_done_for_v0_2.data";
import { v02ChangesMachine, selectVisibleChanges } from "./slide_19_changes_done_for_v0_2.machine";

describe("v0.2 changes machine", () => {
	it("starts with the description and reveals one item per subslide in both directions", () => {
		const actor = createActor(v02ChangesMachine).start();
		const states = [
			"description",
			"pingoraProxy",
			"lockFreeTracking",
			"reducedPoolState",
			"batchedMessages",
			"simplifiedStructures",
		];
		expect(actor.getSnapshot().can({ type: "PREVIOUS" })).toBe(false);
		actor.send({ type: "PREVIOUS" });
		for (let index = 0; index < states.length; index++) {
			expect(actor.getSnapshot().value).toBe(states[index]);
			expect(selectVisibleChanges(actor.getSnapshot())).toEqual(changes.slice(0, index));
			actor.send({ type: "NEXT" });
		}
		expect(actor.getSnapshot().can({ type: "NEXT" })).toBe(false);
		for (let index = states.length - 1; index >= 0; index--) {
			expect(actor.getSnapshot().value).toBe(states[index]);
			expect(selectVisibleChanges(actor.getSnapshot())).toEqual(changes.slice(0, index));
			actor.send({ type: "PREVIOUS" });
		}
		expect(actor.getSnapshot().value).toBe("description");
		actor.stop();
	});
});
