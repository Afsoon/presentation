import { setup, type SnapshotFrom } from "xstate";

import { goals } from "./slide_7_implementation_goals.data";

export const implementationGoalsMachine = setup({
	types: { events: {} as { type: "NEXT" } | { type: "PREVIOUS" } },
}).createMachine({
	id: "implementation-goals",
	initial: "transparency",
	states: {
		transparency: { on: { NEXT: "poolStrategy" } },
		poolStrategy: { on: { PREVIOUS: "transparency", NEXT: "tuning" } },
		tuning: { on: { PREVIOUS: "poolStrategy", NEXT: "performance" } },
		performance: { on: { PREVIOUS: "tuning" } },
	},
});

export function selectImplementationGoal(snapshot: SnapshotFrom<typeof implementationGoalsMachine>) {
	return goals[snapshot.value];
}
