export const integresql = {
	title: "IntegreSQL",
	content:
		"Besides tuning the lease lifetime, the user can skip recreation or immediately recreate a database in the pool.",
	problem: "Tuning IntegreSQL requires finding an adequate pool size, lease lifetime, and per-test cleanup strategy.",
};
export const pgtest = {
	title: "PgTest",
	content: "We can track the number of active connections and trigger cleanup once it reaches zero.",
	problem: "Not all PostgreSQL client pools behave the same way.",
};
