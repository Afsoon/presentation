import Typography from "@/components/ui/typography";
import type { SlideMetadata } from "@/slides/types";

export const metadata = {
	Id: "what-is-pgtest",
	name: "What is pgtest?",
	hasSubslides: false,
} satisfies SlideMetadata;

export const SlideWhatIsPgtest = () => {
	return (
		<div className="space-y-10">
			<div className="max-w-3xl space-y-5">
				<Typography level="h2">What is PgTest?</Typography>
			</div>
			<div className="max-w-3xl">
				<Typography level="p">
					PgTest is a PostgreSQL proxy that manages isolated databases for integration tests.
				</Typography>
				<Typography level="p">
					The core idea is to optimize the ability of create database from template in PostgreSQL, allowing to have
					isolated and fresh database for testing.
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
