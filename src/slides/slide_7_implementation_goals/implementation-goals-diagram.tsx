import { useId } from "react";

import { EasyToTuneDiagram } from "./easy-to-tune-diagram";
import { PerformantDiagram } from "./performant-diagram";
import { PoolStrategyDiagram } from "./pool-strategy-diagram";
import type { ImplementationGoalStage } from "./slide_7_implementation_goals.data";
import { TransparencyDiagram } from "./transparency-diagram";

const diagrams = {
	transparency: TransparencyDiagram,
	poolStrategy: PoolStrategyDiagram,
	tuning: EasyToTuneDiagram,
	performance: PerformantDiagram,
} satisfies Record<ImplementationGoalStage, typeof TransparencyDiagram>;

export function ImplementationGoalsDiagram({ stage }: { stage: ImplementationGoalStage }) {
	const id = useId();
	const Diagram = diagrams[stage];
	return <Diagram id={id} />;
}
