import Typography from "@/components/ui/typography";
import type { SlideMetadata } from "@/slides/types";

export const metadata = {
	Id: "architecture-and-implementation",
	name: "Architecture and implementation",
	hasSubslides: false,
} satisfies SlideMetadata;

export const SlideArchitectureAndImplementation = () => {
	return <Typography level="h2">Architecture and implementation</Typography>;
};
