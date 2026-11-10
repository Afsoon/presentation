export { titleMetadata as metadata } from "@/slides/metadata";

export const SlideTitle = () => {
	return (
		<h1 className="text-4xl font-extrabold text-balance @min-[640px]/slide:text-6xl @min-[1024px]/slide:text-8xl">
			PgTest
		</h1>
	);
};
