import { EasyToTuneDiagram } from "./easy-to-tune-diagram";
import { goals } from "./slide_7_implementation_goals.data";
import type { GoalDiagramProps } from "./transparency-diagram";

export function PerformantDiagram({ id, outside, ...props }: GoalDiagramProps) {
	return (
		<EasyToTuneDiagram
			id={id}
			title={goals.performance.title}
			description="PgTest contains a Postgres Server connected to an external PostgreSQL server. A database pool holds four ready databases, with separate creation and cleanup workers. Database Pool Config sets initial size to 4, prewarm threshold to 2, and batch size to 4. PgTest also contains an admin panel. Four parallel test suites each connect to the Postgres Server."
			{...props}
			outside={
				<>
					<g role="group" aria-label="Test suite">
						<rect x="10" y="205" width="150" height="325" rx="16" className="fill-secondary stroke-border" />
						<text x="85" y="240" fill="currentColor" textAnchor="middle" fontSize="20" fontWeight="600">
							Test suite
						</text>
						{[1, 2, 3, 4].map((suite, i) => (
							<g key={suite} aria-label={`Test suite ${suite}`}>
								<path
									d={`M 140 ${289 + i * 60} H 240`}
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									markerEnd={`url(#${id}-arrow)`}
								/>
								<rect x="30" y={265 + i * 60} width="110" height="48" rx="9" className="fill-card stroke-border" />
								<text x="85" y={295 + i * 60} fill="currentColor" textAnchor="middle" fontSize="17">
									Suite {suite}
								</text>
							</g>
						))}
					</g>
					{outside}
				</>
			}
		/>
	);
}
