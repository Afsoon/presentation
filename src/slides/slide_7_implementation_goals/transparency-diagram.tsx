import { DatabaseIcon } from "lucide-react";
import type { ReactNode } from "react";

import { goals } from "./slide_7_implementation_goals.data";

export type GoalDiagramProps = {
	id: string;
	title?: string;
	description?: string;
	children?: ReactNode;
	outside?: ReactNode;
};

export function TransparencyDiagram({
	id,
	title = goals.transparency.title,
	description = "PgTest contains a Postgres Server connected to an external PostgreSQL server.",
	children,
	outside,
}: GoalDiagramProps) {
	return (
		<svg
			role="img"
			aria-labelledby={`${id}-title ${id}-description`}
			viewBox="0 0 1200 600"
			className="w-full text-foreground"
		>
			<title id={`${id}-title`}>{title}</title>
			<desc id={`${id}-description`}>{description}</desc>
			<defs>
				<marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
					<path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="currentColor" strokeWidth="1.5" />
				</marker>
			</defs>
			<g role="group" aria-label="PgTest">
				<rect
					x="210"
					y="160"
					width="730"
					height="420"
					rx="20"
					className="fill-neutral-200 stroke-primary/50 dark:fill-neutral-700/70"
					strokeWidth="2"
					vectorEffect="non-scaling-stroke"
				/>
				<rect x="235" y="145" width="100" height="30" rx="6" className="fill-background" />
				<text x="285" y="166" textAnchor="middle" fill="currentColor" fontSize="22" fontWeight="600">
					PgTest
				</text>
				<g role="group" aria-label="Postgres Server">
					<rect x="240" y="205" width="140" height="325" rx="16" className="fill-card stroke-border" />
					<DatabaseIcon aria-hidden="true" x="290" y="310" width="40" height="40" className="text-primary" />
					<text x="310" y="385" fill="currentColor" textAnchor="middle" fontSize="22" fontWeight="600">
						<tspan x="310">Postgres</tspan>
						<tspan x="310" dy="28">
							Server
						</tspan>
					</text>
				</g>
				{children}
			</g>
			<path d="M 940 360 H 980" fill="none" stroke="currentColor" strokeWidth="2" markerEnd={`url(#${id}-arrow)`} />
			<g role="group" aria-label="PostgreSQL">
				<rect x="980" y="290" width="170" height="140" rx="16" className="fill-card stroke-border" />
				<DatabaseIcon aria-hidden="true" x="1045" y="315" width="40" height="40" className="text-primary" />
				<text x="1065" y="395" fill="currentColor" textAnchor="middle" fontSize="22" fontWeight="600">
					PostgreSQL
				</text>
			</g>
			{outside}
		</svg>
	);
}
