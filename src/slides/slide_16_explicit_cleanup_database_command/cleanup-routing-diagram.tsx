import { useId } from "react";

export function CleanupRoutingDiagram() {
	const id = useId();
	return (
		<div>
			<svg
				role="img"
				aria-labelledby={`${id}-title ${id}-description`}
				viewBox="0 0 1120 400"
				className="w-full text-foreground"
			>
				<title id={`${id}-title`}>PgTest SQL routing</title>
				<desc id={`${id}-description`}>
					Postgres Server checks the database name. Names other than pgtest are forwarded to PostgreSQL, outside the
					PgTest box. The pgtest database routes to the PgTest Admin Panel, which sends cleanup commands to the Cleanup
					Worker.
				</desc>
				<defs>
					<marker
						id={`${id}-arrow`}
						viewBox="0 0 10 10"
						refX="9"
						refY="5"
						markerWidth="7"
						markerHeight="7"
						orient="auto"
					>
						<path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="currentColor" strokeWidth="1.5" />
					</marker>
				</defs>
				<rect
					x="1"
					y="140"
					width="1118"
					height="250"
					rx="20"
					className="fill-neutral-200 stroke-primary/50 dark:fill-neutral-700/70"
					strokeWidth="2"
					vectorEffect="non-scaling-stroke"
				/>
				<rect x="24" y="125" width="100" height="30" rx="6" className="fill-background" />
				<text
					x="74"
					y="140"
					fill="currentColor"
					textAnchor="middle"
					dominantBaseline="middle"
					fontSize="20"
					fontWeight="600"
				>
					PgTest
				</text>
				<g fill="none" stroke="currentColor" strokeWidth="2" markerEnd={`url(#${id}-arrow)`}>
					<path d="M 200 200 H 280" />
					<path d="M 500 200 H 550 V 80 H 620" />
					<path d="M 500 200 H 550 V 310 H 620" />
					<path d="M 840 310 H 920" />
				</g>
				<g className="fill-card stroke-border" strokeWidth="2">
					<rect x="20" y="160" width="180" height="80" rx="16" />
					<rect x="280" y="160" width="220" height="80" rx="16" className="fill-secondary stroke-primary" />
					<rect x="620" y="40" width="220" height="80" rx="16" />
					<rect x="620" y="270" width="220" height="80" rx="16" />
					<rect x="920" y="270" width="180" height="80" rx="16" />
				</g>
				<g fill="currentColor" textAnchor="middle" dominantBaseline="middle" fontSize="20" fontWeight="600">
					<text x="110" y="200">
						Postgres Server
					</text>
					<text x="390" y="200">
						Check database name
					</text>
					<text x="730" y="80">
						PostgreSQL
					</text>
					<text x="730" y="310">
						PgTest Admin Panel
					</text>
					<text x="1010" y="310">
						Cleanup Worker
					</text>
				</g>
				<g fill="currentColor" textAnchor="end" fontSize="18" className="font-mono">
					<text x="550" y="50">
						!= pgtest
					</text>
					<text x="550" y="360">
						= pgtest
					</text>
				</g>
			</svg>
		</div>
	);
}
