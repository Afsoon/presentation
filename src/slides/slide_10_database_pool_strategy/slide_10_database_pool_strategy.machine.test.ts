import { describe, expect, it } from "vite-plus/test";
import { createActor } from "xstate";

import { createSubslideControlsStore } from "@/stores/subslide-controls";

import { databasePoolStrategyMachine, selectIntegresqlPoolStage } from "./slide_10_database_pool_strategy.machine";

describe("database pool strategy machine", () => {
	it("traverses the animation stages as subslides and reverses them", () => {
		const actor = createActor(databasePoolStrategyMachine).start();
		const expected = [
			{ state: "heading", tags: [] },
			{ state: "integresql", tags: ["integresql"] },
			...[
				"initial",
				"request",
				"leasing",
				"newRequest",
				"newPoolItemReady",
				"leaseNewDatabase",
				"twoNewRequests",
				"processedOneWaiting",
			].map((stage) => ({
				state: { integresqlAnimation: stage },
				tags: ["integresql", "integresqlAnimation"],
			})),
			{ state: "pgtest", tags: ["integresql", "integresqlAnimation", "integresqlCompleted", "pgtest"] },
			{
				state: { pgtestAnimation: "initial" },
				tags: ["integresql", "integresqlAnimation", "integresqlCompleted", "pgtest", "pgtestAnimation"],
			},
			...["request", "leasing", "growPool", "newPoolItems", "threeRequests", "leaseThree", "secondBatchReady"].map(
				(stage) => ({
					state: { pgtestAnimation: stage },
					tags: ["integresql", "integresqlAnimation", "integresqlCompleted", "pgtest", "pgtestAnimation"],
				}),
			),
		];
		expect(actor.getSnapshot().can({ type: "PREVIOUS" })).toBe(false);
		actor.send({ type: "PREVIOUS" });
		for (const step of expected) {
			expect(actor.getSnapshot().value).toEqual(step.state);
			expect(actor.getSnapshot().tags).toEqual(new Set(step.tags));
			expect(actor.getSnapshot().context).toEqual({});
			actor.send({ type: "NEXT" });
		}
		expect(actor.getSnapshot().can({ type: "NEXT" })).toBe(false);
		for (const step of [...expected].reverse()) {
			expect(actor.getSnapshot().value).toEqual(step.state);
			expect(actor.getSnapshot().tags).toEqual(new Set(step.tags));
			actor.send({ type: "PREVIOUS" });
		}
		expect(actor.getSnapshot().value).toBe("heading");
		actor.stop();
	});

	it("keeps the completed animation visible on the PgTest subslides and returns to its last stage", () => {
		const actor = createActor(databasePoolStrategyMachine).start();
		expect(selectIntegresqlPoolStage(actor.getSnapshot())).toBeNull();
		for (let index = 0; index < 10; index++) actor.send({ type: "NEXT" });
		expect(actor.getSnapshot().value).toBe("pgtest");
		expect(selectIntegresqlPoolStage(actor.getSnapshot())).toBe("processedOneWaiting");
		actor.send({ type: "NEXT" });
		expect(selectIntegresqlPoolStage(actor.getSnapshot())).toBe("processedOneWaiting");
		actor.send({ type: "PREVIOUS" });
		actor.send({ type: "PREVIOUS" });
		expect(actor.getSnapshot().value).toEqual({ integresqlAnimation: "processedOneWaiting" });
		actor.send({ type: "PREVIOUS" });
		expect(selectIntegresqlPoolStage(actor.getSnapshot())).toBe("twoNewRequests");
		actor.stop();
	});

	it("supports shared navigation while retaining slide-owned state", () => {
		const store = createSubslideControlsStore();
		const actor = createActor(databasePoolStrategyMachine, { id: "database-pool-strategy" }).start();
		const unregister = store.registerActor(actor);
		store.getActor("database-pool-strategy")?.send({ type: "NEXT" });
		expect(actor.getSnapshot().value).toBe("integresql");
		unregister();
		expect(store.getActor("database-pool-strategy")).toBeUndefined();
		actor.stop();
	});
});
