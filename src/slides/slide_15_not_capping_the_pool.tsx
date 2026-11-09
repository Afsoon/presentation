import Typography from "@/components/ui/typography";
import type { SlideMetadata } from "@/slides/types";

export const metadata = {
	Id: "not-capping-the-pool",
	name: "Not capping the pool.",
	hasSubslides: false,
} satisfies SlideMetadata;

export const SlideNotCappingThePool = () => {
	return (
		<div className="max-w-4xl space-y-8">
			<header className="space-y-3">
				<Typography level="p-small">v0.1 Implementation.</Typography>
				<Typography level="h2">Not capping the pool.</Typography>
			</header>
			<Typography level="p">
				Batching and prewarming are the right strategy for handling bursts of lease requests, but capping the pool size
				makes this strategy ineffective once the pool is full. At that point, we rely on the system to free slots fast
				enough to avoid waiting for a database.
			</Typography>
			<Typography level="p">
				Removing the cap comes with potential problems: if our cleanup policy is not fast enough, memory consumption can
				grow significantly.
			</Typography>
		</div>
	);
};
