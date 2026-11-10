import { DatabaseIcon } from "lucide-react";

import { goals } from "./slide_7_implementation_goals.data";
import { TransparencyDiagram, type GoalDiagramProps } from "./transparency-diagram";

export function PoolStrategyDiagram({ id, children, ...props }: GoalDiagramProps) {
	return (
		<TransparencyDiagram
			id={id}
			title={goals.poolStrategy.title}
			description="PgTest contains a Postgres Server connected to an external PostgreSQL server. A database pool holds four ready databases, with separate creation and cleanup workers."
			{...props}
		>
			<g fill="none" stroke="currentColor" strokeWidth="2" markerEnd={`url(#${id}-arrow)`}>
				<path d="M 380 367 H 400 V 280 H 420" />
				<path d="M 540 375 V 355" />
				<path d="M 800 375 V 355" />
			</g>{" "}
			<>
				<g role="group" aria-label="Database pool">
					<rect x="420" y="205" width="500" height="150" rx="14" className="fill-card stroke-border" />
					<text x="440" y="235" fill="currentColor" fontSize="19" fontWeight="600">
						Database pool
					</text>
					<text x="900" y="235" fill="currentColor" textAnchor="end" fontSize="17">
						4 ready
					</text>
					{[1, 2, 3, 4].map((database, i) => (
						<g key={database} aria-label={`Database ${database}: ready`}>
							<rect
								x={440 + i * 117}
								y="255"
								width="109"
								height="80"
								rx="10"
								className="fill-secondary stroke-border"
							/>
							<DatabaseIcon aria-hidden="true" x={480 + i * 117} y="265" width="28" height="28" />
							<text x={494 + i * 117} y="320" fill="currentColor" textAnchor="middle" fontSize="17">
								DB {database}
							</text>
						</g>
					))}
				</g>
				{[
					{ name: "Creation Worker", x: 420, color: "text-sky-800 dark:text-sky-200", count: 4 },
					{ name: "Cleanup Worker", x: 680, color: "text-rose-800 dark:text-rose-200", count: 2 },
				].map((worker) => (
					<g key={worker.name} role="group" aria-label={worker.name}>
						<rect x={worker.x} y="375" width="240" height="105" rx="14" className="fill-card stroke-border" />
						<text x={worker.x + 120} y="403" textAnchor="middle" fill="currentColor" fontSize="18" fontWeight="600">
							{worker.name}
						</text>
						{Array.from({ length: worker.count }, (_, i) => (
							<g key={i} className={worker.color}>
								<rect
									x={worker.x + 20 + i * 52}
									y="418"
									width="44"
									height="44"
									rx="8"
									fill="currentColor"
									fillOpacity="0.12"
									stroke="currentColor"
								/>
								<DatabaseIcon aria-hidden="true" x={worker.x + 30 + i * 52} y="428" width="24" height="24" />
							</g>
						))}
					</g>
				))}
			</>
			{children}
		</TransparencyDiagram>
	);
}
