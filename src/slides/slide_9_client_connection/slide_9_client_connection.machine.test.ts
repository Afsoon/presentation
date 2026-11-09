import { describe, expect, it } from "vite-plus/test";
import { createActor } from "xstate";

import { createSubslideControlsStore } from "@/stores/subslide-controls";

import { clientConnectionMachine } from "./slide_9_client_connection.machine";

describe("client connection machine", () => {
	it("traverses all four subslides in both directions", () => {
		const actor = createActor(clientConnectionMachine).start();
		const states = ["heading", "integresql", "bothClients", "codeComparison"];
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
		const actor = createActor(clientConnectionMachine, { id: "client-connection" }).start();
		const unregister = store.registerActor(actor);
		store.getActor("client-connection")?.send({ type: "NEXT" });
		expect(actor.getSnapshot().value).toBe("integresql");
		unregister();
		expect(store.getActor("client-connection")).toBeUndefined();
		actor.stop();
	});
});
