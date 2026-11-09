import { setup, type SnapshotFrom } from "xstate";

import { goals } from "./slide_7_implementation_goals.data";

export const implementationGoalsMachine = setup({
	types: { events: {} as { type: "NEXT" } | { type: "PREVIOUS" } },
}).createMachine({
	id: "implementation-goals",
	initial: "performance",
	states: {
		performance: { on: { NEXT: "parallelTestSuites" } },
		parallelTestSuites: { on: { PREVIOUS: "performance", NEXT: "transparency" } },
		transparency: { on: { PREVIOUS: "parallelTestSuites", NEXT: "tuning" } },
		tuning: { on: { PREVIOUS: "transparency" } },
	},
});

const visibleGoals = {
	performance: goals.slice(0, 1),
	parallelTestSuites: goals.slice(0, 2),
	transparency: goals.slice(0, 3),
	tuning: goals,
};

export function selectVisibleGoals(snapshot: SnapshotFrom<typeof implementationGoalsMachine>) {
	return visibleGoals[snapshot.value];
}
