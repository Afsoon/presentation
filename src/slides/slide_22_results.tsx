import Typography from "@/components/ui/typography";
import type { SlideMetadata } from "@/slides/types";
export const metadata = { Id: "results", name: "Results", hasSubslides: false } satisfies SlideMetadata;
export const SlideResults = () => (
	<div className="space-y-8">
		<header className="space-y-3">
			<Typography level="p-small">Conclusion</Typography>
			<Typography level="h2">Results</Typography>
		</header>
		<Typography level="p">
			The current version, v0.2, is 40%–50% faster in CI than IntegreSQL and 20%–30% faster locally.
		</Typography>
		<Typography level="p">
			Tuning PgTest requires only an initial pool size, a threshold to trigger prewarming, and an appropriate batch size
			for pool growth.
		</Typography>
		<Typography level="p">
			By default, the initial pool size and batch size should match the number of tests running in parallel, with the
			prewarming threshold set to half that number.
		</Typography>
	</div>
);
