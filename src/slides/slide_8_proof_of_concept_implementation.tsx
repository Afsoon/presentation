import Typography from "@/components/ui/typography";
import type { SlideMetadata } from "@/slides/types";

export const metadata = {
	Id: "proof-of-concept-implementation",
	name: "Proof of concept implementation",
	hasSubslides: false,
} satisfies SlideMetadata;

export const SlideProofOfConceptImplementation = () => {
	return (
		<div className="max-w-3xl space-y-5">
			<Typography level="h2">Proof of concept implementation</Typography>
			<Typography level="p">
				This version shares the same idea as IntegreSQL but differs in setup and pool management.
			</Typography>
		</div>
	);
};
