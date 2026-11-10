export { titleMetadata as metadata } from "@/slides/metadata";

export const SlideTitle = () => {
	return (
		<div className="space-y-6">
			<h1 className="text-4xl font-extrabold text-balance @min-[640px]/slide:text-6xl @min-[1024px]/slide:text-8xl">
				PgTest
			</h1>
			<p className="max-w-3xl text-xl text-muted-foreground @min-[640px]/slide:text-3xl">
				How I built a PostgreSQL proxy for integration tests
			</p>
		</div>
	);
};
