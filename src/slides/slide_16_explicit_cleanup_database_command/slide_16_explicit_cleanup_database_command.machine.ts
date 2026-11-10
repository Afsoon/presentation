import { setup } from "xstate";

export const explicitCleanupMachine = setup({
	types: { events: {} as { type: "NEXT" } | { type: "PREVIOUS" } },
}).createMachine({
	id: "explicit-cleanup-database-command",
	initial: "description",
	states: {
		description: { on: { NEXT: "routing" } },
		routing: { on: { PREVIOUS: "description" } },
	},
});
