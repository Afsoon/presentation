import { setup, type SnapshotFrom } from "xstate";

import { changes } from "./slide_14_extract_io_from_manager.data";

export const extractIoMachine = setup({
	types: { events: {} as { type: "NEXT" } | { type: "PREVIOUS" } },
}).createMachine({
	id: "extract-io-from-manager",
	initial: "description",
	states: {
		description: { on: { NEXT: "resourcePolicy" } },
		resourcePolicy: { on: { PREVIOUS: "description", NEXT: "dedicatedClient" } },
		dedicatedClient: { on: { PREVIOUS: "resourcePolicy", NEXT: "batchCreation" } },
		batchCreation: { on: { PREVIOUS: "dedicatedClient" } },
	},
});
const visibleChanges = {
	description: [],
	resourcePolicy: changes.slice(0, 1),
	dedicatedClient: changes.slice(0, 2),
	batchCreation: changes,
};
export function selectVisibleChanges(snapshot: SnapshotFrom<typeof extractIoMachine>): readonly string[] {
	return visibleChanges[snapshot.value];
}
