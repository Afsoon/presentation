import { PoolStrategyDiagram } from "./pool-strategy-diagram";
import { goals } from "./slide_7_implementation_goals.data";
import type { GoalDiagramProps } from "./transparency-diagram";

export function EasyToTuneDiagram({ id, children, outside, ...props }: GoalDiagramProps) {
	return (
		<PoolStrategyDiagram
			id={id}
			title={goals.tuning.title}
			description="PgTest contains a Postgres Server connected to an external PostgreSQL server. A database pool holds four ready databases, with separate creation and cleanup workers. Database Pool Config sets initial size to 4, prewarm threshold to 2, and batch size to 4. PgTest also contains an admin panel."
			{...props}
			outside={
				<>
					<g role="group" aria-label="Database Pool Config">
						<path
							d="M 710 125 V 205"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeDasharray="5 5"
							markerEnd={`url(#${id}-arrow)`}
						/>
						<rect
							x="500"
							y="10"
							width="420"
							height="115"
							rx="14"
							className="fill-card stroke-primary/50"
							strokeWidth="2"
						/>
						<g fill="currentColor" fontSize="18">
							<text x="520" y="37" fontWeight="600">
								Database Pool Config
							</text>
							<text x="520" y="62">
								Initial Size: 4
							</text>
							<text x="520" y="87">
								Threshold pre warm: 2
							</text>
							<text x="520" y="112">
								Batch size: 4
							</text>
						</g>
					</g>
					{outside}
				</>
			}
		>
			<g role="group" aria-label="PgTest Admin Panel">
				<path d="M 800 500 V 480" fill="none" stroke="currentColor" strokeWidth="2" markerEnd={`url(#${id}-arrow)`} />
				<path
					d="M 380 500 H 400 V 527 H 420"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					markerEnd={`url(#${id}-arrow)`}
				/>
				<rect x="420" y="500" width="500" height="55" rx="12" className="fill-card stroke-primary/50" />
				<text x="670" y="535" fill="currentColor" textAnchor="middle" fontSize="20" fontWeight="600">
					PgTest Admin Panel
				</text>
			</g>
			{children}
		</PoolStrategyDiagram>
	);
}
