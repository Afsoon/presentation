import { setup, type SnapshotFrom } from "xstate";

import { strategies, issues, type ReasonId, type SideListItem } from "./slide_5_reasons_for_building_pgtest.data";

type ReasonsEvent = { type: "NEXT" } | { type: "PREVIOUS" } | { type: "SELECT_REASON"; reason: ReasonId };

export const reasonsMachine = setup({
	types: { events: {} as ReasonsEvent },
}).createMachine({
	id: "reasons-for-building-pgtest",
	initial: "strategies",
	on: {
		SELECT_REASON: [
			{ guard: ({ event }) => event.reason === "strategies", target: ".strategies.transactions" },
			{ guard: ({ event }) => event.reason === "issues", target: ".issues.tuning" },
			{ guard: ({ event }) => event.reason === "rust", target: ".rust" },
			{ guard: ({ event }) => event.reason === "ai", target: ".ai" },
		],
	},
	states: {
		strategies: {
			initial: "transactions",
			states: {
				transactions: { on: { NEXT: "resetting" } },
				resetting: { on: { PREVIOUS: "transactions", NEXT: "mutations" } },
				mutations: { on: { PREVIOUS: "resetting", NEXT: "mocking" } },
				mocking: { on: { PREVIOUS: "mutations", NEXT: "templates" } },
				templates: { on: { PREVIOUS: "mocking", NEXT: "#reasons-for-building-pgtest.issues.tuning" } },
			},
		},
		issues: {
			initial: "tuning",
			states: {
				tuning: { on: { PREVIOUS: "#reasons-for-building-pgtest.strategies.templates", NEXT: "testChanges" } },
				testChanges: { on: { PREVIOUS: "tuning", NEXT: "leasing" } },
				leasing: { on: { PREVIOUS: "testChanges", NEXT: "unsafeHashes" } },
				unsafeHashes: { on: { PREVIOUS: "leasing", NEXT: "longHashes" } },
				longHashes: { on: { PREVIOUS: "unsafeHashes", NEXT: "maintenance" } },
				maintenance: { on: { PREVIOUS: "longHashes", NEXT: "#reasons-for-building-pgtest.rust" } },
			},
		},
		rust: { on: { PREVIOUS: "issues.maintenance", NEXT: "ai" } },
		ai: { on: { PREVIOUS: "rust" } },
	},
});

const strategyItems = {
	transactions: strategies.slice(0, 1),
	resetting: strategies.slice(0, 2),
	mutations: strategies.slice(0, 3),
	mocking: strategies.slice(0, 4),
	templates: strategies,
};
const issueItems = {
	tuning: issues.slice(0, 1),
	testChanges: issues.slice(0, 2),
	leasing: issues.slice(0, 3),
	unsafeHashes: issues.slice(0, 4),
	longHashes: issues.slice(0, 5),
	maintenance: issues,
};

type ReasonsDisplay = { activeReason: ReasonId; rightItems: readonly SideListItem[]; rightLabel: string };
const rustDisplay: ReasonsDisplay = { activeReason: "rust", rightItems: [], rightLabel: "Rust" };
const aiDisplay: ReasonsDisplay = { activeReason: "ai", rightItems: [], rightLabel: "AI writing code" };

export function selectReasonsDisplay(snapshot: SnapshotFrom<typeof reasonsMachine>): ReasonsDisplay {
	const state = snapshot.value;
	if (state === "rust") return rustDisplay;
	if (state === "ai") return aiDisplay;
	if ("strategies" in state) {
		return {
			activeReason: "strategies",
			rightItems: strategyItems[state.strategies],
			rightLabel: "Postgres testing strategies",
		};
	}
	return { activeReason: "issues", rightItems: issueItems[state.issues], rightLabel: "IntegreSQL issues" };
}
