export const integresql = {
	title: "IntegreSQL",
	content: "Users can configure the minimum and maximum database pool sizes.",
	problem: "Once the initial slots are leased, new requests are handled on demand.",
};

export const pgtest = {
	title: "PgTest",
	content: "I kept the pool configuration and added a threshold to trigger prewarming a new batch of databases.",
	problem: "Once the pool is full, this strategy no longer works.",
};
