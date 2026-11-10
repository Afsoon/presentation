import { setup } from "xstate";

export const resultsMachine = setup({
	types: { events: {} as { type: "NEXT" } | { type: "PREVIOUS" } },
}).createMachine({
	id: "results",
	initial: "results",
	states: {
		results: { on: { NEXT: "recap" } },
		recap: { on: { PREVIOUS: "results" } },
	},
});
