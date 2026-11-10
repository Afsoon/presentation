import { describe, expect, it } from "vite-plus/test";
import { createActor } from "xstate";

import { changes } from "./slide_14_extract_io_from_manager.data";
import { extractIoMachine, selectVisibleChanges } from "./slide_14_extract_io_from_manager.machine";

describe("extract I/O machine", () => {
	it("reveals the bullet points, then the before and after diagrams, in both directions", () => {
		const actor = createActor(extractIoMachine).start();
		const states = ["description", "resourcePolicy", "dedicatedClient", "batchCreation", "before", "after"];
		expect(actor.getSnapshot().can({ type: "PREVIOUS" })).toBe(false);
		actor.send({ type: "PREVIOUS" });
		for (let index = 0; index < states.length; index++) {
			expect(actor.getSnapshot().value).toBe(states[index]);
			expect(selectVisibleChanges(actor.getSnapshot())).toEqual(index < 4 ? changes.slice(0, index) : []);
			actor.send({ type: "NEXT" });
		}
		expect(actor.getSnapshot().can({ type: "NEXT" })).toBe(false);
		for (let index = states.length - 1; index >= 0; index--) {
			expect(actor.getSnapshot().value).toBe(states[index]);
			expect(selectVisibleChanges(actor.getSnapshot())).toEqual(index < 4 ? changes.slice(0, index) : []);
			actor.send({ type: "PREVIOUS" });
		}
		expect(actor.getSnapshot().value).toBe("description");
		actor.stop();
	});
});
