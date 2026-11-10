export const description =
	"For v0.2, I focused on simplifying the design and making future changes easier without affecting performance.";

export const changes = [
	{
		id: "pingoraProxy",
		content: (
			<span>
				Integrated{" "}
				<a
					href="https://github.com/cloudflare/pingora"
					target="_blank"
					rel="noreferrer"
					className="underline underline-offset-4"
				>
					Pingora framework
				</a>{" "}
				as the foundation for my proxy.
			</span>
		),
	},
	{
		id: "lockFreeTracking",
		content: "Stored database lease tracking in a concurrent, lock-free data structure.",
	},
	{
		id: "reducedPoolState",
		content: "Reduced the number of states in the pool from 4 to 2.",
	},
	{
		id: "batchedMessages",
		content: "Batched message passing between I/O workers.",
	},
	{
		id: "simplifiedStructures",
		content: "Simplified tracking of requests waiting for a database lease.",
	},
];
