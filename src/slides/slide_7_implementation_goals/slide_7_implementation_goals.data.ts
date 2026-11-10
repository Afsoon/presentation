export const goals = {
	transparency: {
		title: "Transparent for the user",
		description: "I chose a proxy to keep using the existing client.",
		index: 0,
	},
	poolStrategy: {
		title: "New database pool strategy",
		description: "I wanted databases ready before tests needed them.",
		index: 1,
	},
	tuning: { title: "Easy to tune", description: "I wanted fewer settings to adjust as the suite grew.", index: 2 },
	performance: {
		title: "Performant",
		description: "I needed to handle concurrent requests with minimal overhead.",
		index: 3,
	},
} as const;

export type ImplementationGoalStage = keyof typeof goals;
