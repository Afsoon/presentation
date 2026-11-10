import { DatabaseIcon } from "lucide-react";
import { useId } from "react";

function Worker({ name, hasClient }: { name: string; hasClient: boolean }) {
	return (
		<div className="flex min-w-0 min-h-36 flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card p-2 sm:p-4 text-card-foreground shadow-lg">
			<span className="w-full break-words text-center text-sm sm:text-lg font-semibold">{name}</span>
			{hasClient && (
				<div className="flex max-w-full flex-wrap items-center justify-center gap-2 rounded-lg border border-primary/50 bg-primary/15 px-2 sm:px-4 py-3 text-xs sm:text-sm text-center font-medium">
					<DatabaseIcon aria-hidden="true" className="size-5 shrink-0" />
					PG client
				</div>
			)}
		</div>
	);
}

function Connection({ branches = false }: { branches?: boolean }) {
	const markerId = useId();
	return (
		<svg
			aria-hidden="true"
			viewBox={branches ? "0 0 80 312" : "0 0 80 40"}
			preserveAspectRatio="none"
			className={branches ? "h-[19.5rem] w-full text-foreground" : "h-10 w-full text-foreground"}
		>
			<defs>
				<marker
					id={markerId}
					viewBox="0 0 10 10"
					refX="5"
					refY="5"
					markerWidth="5"
					markerHeight="5"
					orient="auto-start-reverse"
				>
					<path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="currentColor" strokeWidth="1.5" />
				</marker>
			</defs>
			{(branches ? ["M 10 156 L 70 72", "M 10 156 L 70 240"] : ["M 10 20 H 70"]).map((path) => (
				<path
					key={path}
					d={path}
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					markerStart={`url(#${markerId})`}
					markerEnd={`url(#${markerId})`}
				/>
			))}
		</svg>
	);
}

export function WorkerDiagram({ stage }: { stage: "before" | "after" }) {
	const after = stage === "after";
	return (
		<section aria-label={after ? "After extracting I/O" : "Before extracting I/O"} className="space-y-6">
			<h3 className="text-2xl font-semibold">{after ? "After" : "Before"}</h3>
			<p className="sr-only">
				{after
					? "Postgres Server communicates bidirectionally with the Manager Worker, which communicates bidirectionally with both the Creation Worker and Cleanup Worker. Each of those workers has its own PG client; the manager has none."
					: "Postgres Server communicates bidirectionally with the Manager Worker, which contains a PG client."}
			</p>
			<div role="group" aria-label="PgTest" className="relative rounded-2xl border-2 border-primary/50 bg-muted/30 p-4">
				<span className="absolute -top-3 left-6 bg-background px-3 text-base font-semibold">PgTest</span>
				<div
					className={`grid min-h-[19.5rem] items-center ${after ? "grid-cols-[minmax(0,1fr)_clamp(1rem,5vw,5rem)_minmax(0,1fr)_clamp(1rem,5vw,5rem)_minmax(0,1fr)]" : "mx-auto max-w-3xl grid-cols-[minmax(0,1fr)_clamp(1rem,5vw,5rem)_minmax(0,1fr)]"}`}
				>
					<div className="flex min-w-0 min-h-36 items-center justify-center rounded-2xl border border-border bg-neutral-200 p-2 sm:p-4 dark:bg-neutral-700/70">
						<div className="flex min-w-0 flex-col items-center gap-3 rounded-lg border bg-card px-2 sm:px-5 py-4 text-center text-sm sm:text-base font-semibold text-card-foreground">
							<DatabaseIcon aria-hidden="true" className="size-8 text-primary" />
							<span className="w-full break-words">Postgres Server</span>
						</div>
					</div>
					<Connection />
					<Worker name="Manager Worker" hasClient={!after} />
					{after && (
						<>
							<Connection branches />
							<div className="space-y-6">
								<Worker name="Creation Worker" hasClient />
								<Worker name="Cleanup Worker" hasClient />
							</div>
						</>
					)}
				</div>
			</div>
		</section>
	);
}
