export const integresql = {
	title: "IntegreSQL",
	content:
		"Database cleanup is based on a user-defined lifetime, an explicit request to skip cleanup, or an explicit request for immediate cleanup.",
	problem: "Cleanup is time-sensitive.",
};
export const pgtest = {
	title: "PgTest",
	content: "I tried tracking active connections and triggering cleanup when the count reached zero.",
	problem: "Not all PostgreSQL client pools behave the same way.",
};
