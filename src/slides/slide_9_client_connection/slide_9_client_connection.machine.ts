import { setup } from "xstate";

export const clientConnectionMachine = setup({
	types: { events: {} as { type: "NEXT" } | { type: "PREVIOUS" } },
}).createMachine({
	id: "client-connection",
	initial: "heading",
	states: {
		heading: { on: { NEXT: "integresql" } },
		integresql: { on: { PREVIOUS: "heading", NEXT: "bothClients" } },
		bothClients: { on: { PREVIOUS: "integresql", NEXT: "codeComparison" } },
		codeComparison: { on: { PREVIOUS: "bothClients" } },
	},
});
