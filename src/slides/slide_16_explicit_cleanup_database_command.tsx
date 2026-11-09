import Typography from "@/components/ui/typography";
import type { SlideMetadata } from "@/slides/types";

export const metadata = {
	Id: "explicit-cleanup-database-command",
	name: "Explicit cleanup database command",
	hasSubslides: false,
} satisfies SlideMetadata;

export const SlideExplicitCleanupDatabaseCommand = () => {
	return (
		<div className="max-w-4xl space-y-8">
			<header className="space-y-3">
				<Typography level="p-small">v0.1 Implementation.</Typography>
				<Typography level="h2">Explicit cleanup database command</Typography>
			</header>
			<Typography level="p">
				By default, all databases are disposed of after 60 seconds, or the timeout configured by the user. To dispose of
				a database earlier, the user must explicitly run{" "}
				<Typography level="code">SELECT pgtest_release($1::text)</Typography> with{" "}
				<Typography level="code">[id]</Typography> as the query parameters.
			</Typography>
			<Typography level="p">
				Instead of adding a REST API, administration is handled through SQL by connecting to a special database named{" "}
				<Typography level="code">pgtest</Typography>. This lets users reuse their PostgreSQL client without creating a
				separate REST client.
			</Typography>
		</div>
	);
};
