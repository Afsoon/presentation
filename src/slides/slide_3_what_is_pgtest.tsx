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
				<Typography level="p">
					PgTest is a PostgreSQL proxy that manages isolated databases for integration tests. Connect using a lease ID
					to get a database cloned from your template
				</Typography>
			</div>
			<ol role="list" className="workflow-steps grid gap-6 md:grid-cols-3">
				<li className="space-y-3 rounded-xl border bg-card p-6">
					<Typography level="h3">Arrange</Typography>
					<Typography level="p">Initialize a database and preseed it before executing your test suite.</Typography>
				</li>
				<li className="space-y-3 rounded-xl border bg-card p-6">
					<Typography level="h3">Act</Typography>
					<Typography level="p">
						Lease a database each time you need an isolated database. You only need a unique identifier; the rest is
						managed by PgTest.
					</Typography>
				</li>
				<li className="space-y-3 rounded-xl border bg-card p-6">
					<Typography level="h3">Assert (to be reviewed)</Typography>
					<Typography level="p">Execute your test. PgTest will proxy your queries to the leased database.</Typography>
				</li>
			</ol>
		</div>
	);
};
