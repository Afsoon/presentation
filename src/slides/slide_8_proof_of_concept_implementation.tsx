import Typography from "@/components/ui/typography";

export { proofOfConceptMetadata as metadata } from "@/slides/metadata";

export const SlideProofOfConceptImplementation = () => {
	return (
		<div className="max-w-3xl space-y-5">
			<Typography level="h2">Proof of concept implementation</Typography>
			<Typography level="p">
				For my first version, I kept IntegreSQL’s template idea and tried different approaches to setup, pool
				management, and cleanup.
			</Typography>
		</div>
	);
};
