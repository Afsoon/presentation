import { setup, type SnapshotFrom } from "xstate";

import { sections } from "./slide_2_table_of_content.data";

export const tableOfContentsMachine = setup({
	types: { events: {} as { type: "NEXT" } | { type: "PREVIOUS" } },
}).createMachine({
	id: "table-of-contents",
	initial: "whatIsPgtest",
	states: {
		whatIsPgtest: { on: { NEXT: "whyBuildIt" } },
		whyBuildIt: { on: { PREVIOUS: "whatIsPgtest", NEXT: "architecture" } },
		architecture: { on: { PREVIOUS: "whyBuildIt", NEXT: "conclusion" } },
		conclusion: { on: { PREVIOUS: "architecture" } },
	},
});

const visibleSections = {
	whatIsPgtest: sections.slice(0, 1),
	whyBuildIt: sections.slice(0, 2),
	architecture: sections.slice(0, 3),
	conclusion: sections,
};

export function selectVisibleSections(snapshot: SnapshotFrom<typeof tableOfContentsMachine>) {
	return visibleSections[snapshot.value];
}
