import Typography from "@/components/ui/typography";
import type { SlideMetadata } from "@/slides/types";

export const metadata = {
	Id: "why-am-i-building-it",
	name: "Why am I building it?",
	hasSubslides: false,
} satisfies SlideMetadata;

export const SlideWhyAmIBuildingIt = () => {
	return <Typography level="h2">Why am I building it?</Typography>;
};
