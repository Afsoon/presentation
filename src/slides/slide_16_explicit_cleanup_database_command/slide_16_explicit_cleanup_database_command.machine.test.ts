import { describe, expect, it } from "vite-plus/test";
import { createActor } from "xstate";

import { createSubslideControlsStore } from "@/stores/subslide-controls";

import { explicitCleanupMachine } from "./slide_16_explicit_cleanup_database_command.machine";

describe("explicit cleanup subslides", () => {
	it("navigates from the explanation to SQL routing and back through the shared controls", () => {
		const actor = createActor(explicitCleanupMachine, { id: "explicit-cleanup-database-command" }).start();
		const store = createSubslideControlsStore();
		const unregister = store.registerActor(actor);
		expect(actor.getSnapshot().value).toBe("description");
		expect(actor.getSnapshot().can({ type: "PREVIOUS" })).toBe(false);
		store.getActor(actor.id)?.send({ type: "NEXT" });
		expect(actor.getSnapshot().value).toBe("routing");
		expect(actor.getSnapshot().can({ type: "NEXT" })).toBe(false);
		store.getActor(actor.id)?.send({ type: "PREVIOUS" });
		expect(actor.getSnapshot().value).toBe("description");
		unregister();
		expect(store.getActor(actor.id)).toBeUndefined();
		actor.stop();
	});
});
