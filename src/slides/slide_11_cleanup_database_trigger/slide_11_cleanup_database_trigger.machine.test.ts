import { describe, expect, it } from "vite-plus/test";
import { createActor } from "xstate";

import { createSubslideControlsStore } from "@/stores/subslide-controls";

import { cleanupDatabaseTriggerMachine } from "./slide_11_cleanup_database_trigger.machine";

describe("cleanup database trigger machine", () => {
	it("traverses all three subslides in both directions", () => {
		const actor = createActor(cleanupDatabaseTriggerMachine).start();
		const states = ["heading", "integresql", "bothClients"];
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
		expect(actor.getSnapshot().value).toBe("heading");
		actor.stop();
	});

	it("accepts navigation through the subslide controls store", () => {
		const store = createSubslideControlsStore();
		const actor = createActor(cleanupDatabaseTriggerMachine, { id: "cleanup-database-trigger" }).start();
		const unregister = store.registerActor(actor);
		store.getActor("cleanup-database-trigger")?.send({ type: "NEXT" });
		expect(actor.getSnapshot().value).toBe("integresql");
		unregister();
		expect(store.getActor("cleanup-database-trigger")).toBeUndefined();
		actor.stop();
	});
});
