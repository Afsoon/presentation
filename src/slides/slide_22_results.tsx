import { useSelector } from "@xstate/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import Typography from "@/components/ui/typography";
import { resultsMetadata as metadata } from "@/slides/metadata";
import { ImplementationGoalsDiagram } from "@/slides/slide_7_implementation_goals/implementation-goals-diagram";
import { useSlideActor } from "@/stores/use-slide-actor";

import { resultsMachine } from "./slide_22_results/slide_22_results.machine";

export { resultsMetadata as metadata } from "@/slides/metadata";

export const SlideResults = () => {
	const actor = useSlideActor(resultsMachine, metadata.Id);
	const stage = useSelector(actor, (snapshot) => snapshot.value);
	const reduceMotion = useReducedMotion();
	return (
		<div className="space-y-8">
			<header className="space-y-3">
				<Typography level="p-small">Conclusion</Typography>
				<Typography level="h2">Results</Typography>
			</header>
			<div className="min-h-[36rem]">
				<AnimatePresence initial={false} mode="wait">
					<motion.div
						key={stage}
						initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: reduceMotion ? 0 : -16 }}
						transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
					>
						{stage === "recap" ? (
							<div className="space-y-6">
								<Typography level="h3">Final architecture</Typography>
								<ImplementationGoalsDiagram stage="performance" />
							</div>
						) : (
							<div className="space-y-8">
								<Typography level="p">
									My initial measurements show v0.2 running 40%–50% faster in CI than IntegreSQL and 20%–30% faster
									locally.
								</Typography>
								<Typography level="p">
									I ended up with three main pool settings: initial size, a threshold to trigger prewarming, and a batch
									size for pool growth.
								</Typography>
								<Typography level="p">
									The design evolved through early replenishment, explicit cleanup, and a simpler pool lifecycle: from 7
									states to 4, then 2.
								</Typography>
							</div>
						)}
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
};
