import { setup } from "xstate";

export const cleanupDatabaseTriggerMachine = setup({
	types: { events: {} as { type: "NEXT" } | { type: "PREVIOUS" } },
}).createMachine({
	id: "cleanup-database-trigger",
	initial: "heading",
	states: {
		heading: { on: { NEXT: "integresql" } },
		integresql: { on: { PREVIOUS: "heading", NEXT: "bothClients" } },
		bothClients: { on: { PREVIOUS: "integresql" } },
	},
});
