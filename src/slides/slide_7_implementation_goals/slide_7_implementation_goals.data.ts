export const goals = {
	transparency: { title: "Transparent for the user", description: "Working as a Postgres proxy.", index: 0 },
	poolStrategy: { title: "New database pool strategy", description: "A strategy to reduce wait time.", index: 1 },
	tuning: { title: "Easy to tune", description: "Few variables to tweak for maximum performance.", index: 2 },
	performance: { title: "Performant", description: "Be able to handle multiple requests at once.", index: 3 },
} as const;

export type ImplementationGoalStage = keyof typeof goals;
