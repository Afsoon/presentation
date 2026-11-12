import Typography from "@/components/ui/typography";

export { whatIsPgtestMetadata as metadata } from "@/slides/metadata";

export const SlideWhatIsPgtest = () => {
	return (
		<div className="space-y-10">
			<div className="max-w-3xl space-y-5">
				<Typography level="h2">What is PgTest?</Typography>
			</div>
			<div className="max-w-3xl">
				<Typography level="p">
					I built PgTest, a PostgreSQL proxy that manages isolated databases for integration tests.
				</Typography>
				<Typography level="p">
					The proxy is built around PostgreSQL’s ability to create databases from a template.
				</Typography>
			</div>
			<Typography level="p">
				Heavily inspired by{" "}
				<a
					href="https://github.com/allaboutapps/integresql"
					target="_blank"
					rel="noopener noreferrer"
					className="underline underline-offset-4"
				>
					IntegreSQL
				</a>
			</Typography>
		</div>
	);
};
