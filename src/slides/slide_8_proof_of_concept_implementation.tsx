import Typography from "@/components/ui/typography";

export { proofOfConceptMetadata as metadata } from "@/slides/metadata";

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
