import { setup, type SnapshotFrom } from "xstate";

import { changes } from "./slide_19_changes_done_for_v0_2.data";

export const v02ChangesMachine = setup({
	types: { events: {} as { type: "NEXT" } | { type: "PREVIOUS" } },
}).createMachine({
	id: "changes-done-for-v0-2",
	initial: "description",
	states: {
		description: { on: { NEXT: "pingoraProxy" } },
		pingoraProxy: { on: { PREVIOUS: "description", NEXT: "lockFreeTracking" } },
		lockFreeTracking: { on: { PREVIOUS: "pingoraProxy", NEXT: "reducedPoolState" } },
		reducedPoolState: { on: { PREVIOUS: "lockFreeTracking", NEXT: "batchedMessages" } },
		batchedMessages: { on: { PREVIOUS: "reducedPoolState", NEXT: "simplifiedStructures" } },
		simplifiedStructures: { on: { PREVIOUS: "batchedMessages" } },
	},
});
const visibleChanges = {
	description: [],
	pingoraProxy: changes.slice(0, 1),
	lockFreeTracking: changes.slice(0, 2),
	reducedPoolState: changes.slice(0, 3),
	batchedMessages: changes.slice(0, 4),
	simplifiedStructures: changes,
};
export function selectVisibleChanges(
	snapshot: SnapshotFrom<typeof v02ChangesMachine>,
): readonly (typeof changes)[number][] {
	return visibleChanges[snapshot.value];
}
