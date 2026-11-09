import Typography from "@/components/ui/typography";
import type { SlideMetadata } from "@/slides/types";

export const metadata = {
	Id: "v0-1-implementation",
	name: "v0.1 implementation",
	hasSubslides: false,
} satisfies SlideMetadata;

export const SlideV01Implementation = () => {
	return <Typography level="h2">v0.1 Implementation</Typography>;
};
