export type ImplementationGoal = {
	id: string;
	requirement: string;
	solution: string;
};

export const goals: readonly ImplementationGoal[] = [
	{ id: "performance", requirement: "Prioritize performance", solution: "Rust" },
	{
		id: "parallelTestSuites",
		requirement: "Handle parallel test suites and bursts of requests",
		solution: "New database pool strategy",
	},
	{ id: "transparency", requirement: "Be transparent to the user", solution: "Postgres proxy" },
	{ id: "tuning", requirement: "Be easy to tune", solution: "Reduce time-based operations" },
];
