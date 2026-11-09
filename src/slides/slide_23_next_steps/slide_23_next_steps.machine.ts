import { setup, type SnapshotFrom } from "xstate";

import { changes } from "./slide_23_next_steps.data";
export const nextStepsMachine = setup({
	types: { events: {} as { type: "NEXT" } | { type: "PREVIOUS" } },
}).createMachine({
	id: "next-steps",
	initial: "description",
	states: {
		description: { on: { NEXT: "benchmarking" } },
		benchmarking: { on: { PREVIOUS: "description", NEXT: "documentation" } },
		documentation: { on: { PREVIOUS: "benchmarking", NEXT: "tuningRelease" } },
		tuningRelease: { on: { PREVIOUS: "documentation", NEXT: "exploringIdeas" } },
		exploringIdeas: { on: { PREVIOUS: "tuningRelease" } },
	},
});
const visibleChanges = {
	description: [],
	benchmarking: changes.slice(0, 1),
	documentation: changes.slice(0, 2),
	tuningRelease: changes.slice(0, 3),
	exploringIdeas: changes,
};
export function selectVisibleChanges(
	snapshot: SnapshotFrom<typeof nextStepsMachine>,
): readonly (typeof changes)[number][] {
	return visibleChanges[snapshot.value];
}
