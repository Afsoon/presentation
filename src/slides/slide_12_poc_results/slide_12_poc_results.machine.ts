import { setup, type SnapshotFrom } from "xstate";

import { results } from "./slide_12_poc_results.data";

export const pocResultsMachine = setup({
	types: { events: {} as { type: "NEXT" } | { type: "PREVIOUS" } },
}).createMachine({
	id: "poc-results",
	initial: "poolStarvation",
	states: {
		poolStarvation: { on: { NEXT: "connectionContention" } },
		connectionContention: { on: { PREVIOUS: "poolStarvation", NEXT: "slotStates" } },
		slotStates: { on: { PREVIOUS: "connectionContention", NEXT: "cleanupReliability" } },
		cleanupReliability: { on: { PREVIOUS: "slotStates" } },
	},
});
const visibleResults = {
	poolStarvation: results.slice(0, 1),
	connectionContention: results.slice(0, 2),
	slotStates: results.slice(0, 3),
	cleanupReliability: results,
};
export function selectVisibleResults(snapshot: SnapshotFrom<typeof pocResultsMachine>) {
	return visibleResults[snapshot.value];
}
