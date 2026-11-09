import Typography from "@/components/ui/typography";
import type { SlideMetadata } from "@/slides/types";

export const metadata = {
	Id: "v0-2-implementation",
	name: "v0.2 implementation",
	hasSubslides: false,
} satisfies SlideMetadata;

export const SlideV02Implementation = () => {
	return (
		<div className="space-y-8">
			<Typography level="h2">v0.2 implementation</Typography>
			<Typography level="p">Goal: Simplify</Typography>
		</div>
	);
};
