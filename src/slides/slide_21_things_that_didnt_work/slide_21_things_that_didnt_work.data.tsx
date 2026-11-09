export const description =
	"Not all the ideas I tried worked. Beyond what we saw during the proof-of-concept phase, these included:";
export const changes = [
	{
		id: "connectionPrewarming",
		content: "Prewarming PostgreSQL connections. Harder than expected, with a lot of nuance.",
	},
	{
		id: "zeroCopyTransfers",
		content: (
			<>
				Using{" "}
				<a
					href="https://man7.org/linux/man-pages/man2/splice.2.html"
					target="_blank"
					rel="noreferrer"
					className="underline underline-offset-4"
				>
					splice
				</a>{" "}
				for zero-copy transfers.
			</>
		),
	},
	{ id: "threadPerCore", content: "A thread-per-core, shared-nothing concurrency model." },
];
