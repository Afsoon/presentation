import { setup, type SnapshotFrom } from "xstate";

import { changes } from "./slide_21_things_that_didnt_work.data";
export const thingsThatDidntWorkMachine = setup({
	types: { events: {} as { type: "NEXT" } | { type: "PREVIOUS" } },
}).createMachine({
	id: "things-that-didnt-work",
	initial: "description",
	states: {
		description: { on: { NEXT: "connectionPrewarming" } },
		connectionPrewarming: { on: { PREVIOUS: "description", NEXT: "zeroCopyTransfers" } },
		zeroCopyTransfers: { on: { PREVIOUS: "connectionPrewarming", NEXT: "threadPerCore" } },
		threadPerCore: { on: { PREVIOUS: "zeroCopyTransfers" } },
	},
});
const visibleChanges = {
	description: [],
	connectionPrewarming: changes.slice(0, 1),
	zeroCopyTransfers: changes.slice(0, 2),
	threadPerCore: changes,
};
export function selectVisibleChanges(
	snapshot: SnapshotFrom<typeof thingsThatDidntWorkMachine>,
): readonly (typeof changes)[number][] {
	return visibleChanges[snapshot.value];
}
