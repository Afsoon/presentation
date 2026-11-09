import { setup, type SnapshotFrom } from "xstate";

import { results } from "./slide_17_v0_1_results.data";

export const v01ResultsMachine = setup({
	types: { events: {} as { type: "NEXT" } | { type: "PREVIOUS" } },
}).createMachine({
	id: "v0-1-results",
	initial: "batchReplenishment",
	states: {
		batchReplenishment: { on: { NEXT: "fewerStates" } },
		fewerStates: { on: { PREVIOUS: "batchReplenishment", NEXT: "speedAndReliability" } },
		speedAndReliability: { on: { PREVIOUS: "fewerStates", NEXT: "releaseReady" } },
		releaseReady: { on: { PREVIOUS: "speedAndReliability" } },
	},
});
const visibleResults = {
	batchReplenishment: results.slice(0, 1),
	fewerStates: results.slice(0, 2),
	speedAndReliability: results.slice(0, 3),
	releaseReady: results,
};
export function selectVisibleResults(snapshot: SnapshotFrom<typeof v01ResultsMachine>) {
	return visibleResults[snapshot.value];
}
