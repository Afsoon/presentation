import { setup } from "xstate";

export const uncappedPoolMachine = setup({
	types: { events: {} as { type: "NEXT" } | { type: "PREVIOUS" } },
}).createMachine({
	id: "not-capping-the-pool",
	initial: "description",
	states: {
		description: { on: { NEXT: "animation" } },
		animation: { on: { PREVIOUS: "description" } },
	},
});
