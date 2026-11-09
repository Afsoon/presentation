export const integresql = {
	title: "IntegreSQL",
	content: "The user can define a minimum number of databases and a maximum pool size.",
	problem: "Once the initial slots are leased, new requests are handled on demand.",
};

export const pgtest = {
	title: "PgTest",
	content: "The same configuration, with the option to prewarm a batch of new databases after a certain threshold.",
	problem: "Once the pool is full, this strategy no longer works.",
};
