export const description =
	"This version focused on simplification and laying the foundation for future versions without affecting performance.";

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
				as the foundation for our proxy.
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
