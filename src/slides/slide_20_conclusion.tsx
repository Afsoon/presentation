import Typography from "@/components/ui/typography";
import type { SlideMetadata } from "@/slides/types";
export const metadata = { Id: "conclusion", name: "Conclusion", hasSubslides: false } satisfies SlideMetadata;
export const SlideConclusion = () => (
	<div className="space-y-8">
		<Typography level="h2">Conclusion</Typography>
	</div>
);
