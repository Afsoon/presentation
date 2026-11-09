import { setup, type SnapshotFrom } from "xstate";

import type { IntegresqlPoolStage } from "./integresql-pool-animation.data";
import type { PgtestPoolStage } from "./pgtest-pool-animation.data";

export const databasePoolStrategyMachine = setup({
	types: { events: {} as { type: "NEXT" } | { type: "PREVIOUS" } },
}).createMachine({
	id: "database-pool-strategy",
	initial: "heading",
	states: {
		heading: { on: { NEXT: "integresql" } },
		integresql: {
			tags: ["integresql"],
			on: { PREVIOUS: "heading", NEXT: "integresqlAnimation" },
		},
		integresqlAnimation: {
			tags: ["integresql", "integresqlAnimation"],
			initial: "initial",
			states: {
				initial: { on: { PREVIOUS: "#database-pool-strategy.integresql", NEXT: "request" } },
				request: { on: { PREVIOUS: "initial", NEXT: "leasing" } },
				leasing: { on: { PREVIOUS: "request", NEXT: "newRequest" } },
				newRequest: { on: { PREVIOUS: "leasing", NEXT: "newPoolItemReady" } },
				newPoolItemReady: { on: { PREVIOUS: "newRequest", NEXT: "leaseNewDatabase" } },
				leaseNewDatabase: { on: { PREVIOUS: "newPoolItemReady", NEXT: "twoNewRequests" } },
				twoNewRequests: { on: { PREVIOUS: "leaseNewDatabase", NEXT: "processedOneWaiting" } },
				processedOneWaiting: { on: { PREVIOUS: "twoNewRequests", NEXT: "#database-pool-strategy.pgtest" } },
			},
		},
		pgtest: {
			tags: ["integresql", "integresqlAnimation", "integresqlCompleted", "pgtest"],
			on: { PREVIOUS: "integresqlAnimation.processedOneWaiting", NEXT: "pgtestAnimation" },
		},
		pgtestAnimation: {
			tags: ["integresql", "integresqlAnimation", "integresqlCompleted", "pgtest", "pgtestAnimation"],
			initial: "initial",
			states: {
				initial: { on: { PREVIOUS: "#database-pool-strategy.pgtest", NEXT: "request" } },
				request: { on: { PREVIOUS: "initial", NEXT: "leasing" } },
				leasing: { on: { PREVIOUS: "request", NEXT: "growPool" } },
				growPool: { on: { PREVIOUS: "leasing", NEXT: "newPoolItems" } },
				newPoolItems: { on: { PREVIOUS: "growPool", NEXT: "threeRequests" } },
				threeRequests: { on: { PREVIOUS: "newPoolItems", NEXT: "leaseThree" } },
				leaseThree: { on: { PREVIOUS: "threeRequests", NEXT: "secondBatchReady" } },
				secondBatchReady: { on: { PREVIOUS: "leaseThree" } },
			},
		},
	},
});

export function selectIntegresqlPoolStage(
	snapshot: SnapshotFrom<typeof databasePoolStrategyMachine>,
): IntegresqlPoolStage | null {
	if (typeof snapshot.value === "object")
		return "integresqlAnimation" in snapshot.value ? snapshot.value.integresqlAnimation : "processedOneWaiting";
	if (snapshot.value === "pgtest") return "processedOneWaiting";
	return null;
}

export function selectPgtestPoolStage(
	snapshot: SnapshotFrom<typeof databasePoolStrategyMachine>,
): PgtestPoolStage | null {
	return typeof snapshot.value === "object" && "pgtestAnimation" in snapshot.value
		? snapshot.value.pgtestAnimation
		: null;
}
