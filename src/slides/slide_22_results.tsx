import { useActorRef, useSelector } from "@xstate/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";

import Typography from "@/components/ui/typography";
import { resultsMetadata as metadata } from "@/slides/metadata";
import { ImplementationGoalsDiagram } from "@/slides/slide_7_implementation_goals/implementation-goals-diagram";
import { subslideControlsStore } from "@/stores/subslide-controls";

import { resultsMachine } from "./slide_22_results/slide_22_results.machine";

export { resultsMetadata as metadata } from "@/slides/metadata";

export const SlideResults = () => {
	const actor = useActorRef(resultsMachine, { id: metadata.Id });
	useEffect(() => subslideControlsStore.registerActor(actor), [actor]);
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
									The current version, v0.2, is 40%–50% faster in CI than IntegreSQL and 20%–30% faster locally.
								</Typography>
								<Typography level="p">
									Tuning PgTest requires only an initial pool size, a threshold to trigger prewarming, and an
									appropriate batch size for pool growth.
								</Typography>
								<Typography level="p">
									By default, the initial pool size and batch size should match the number of tests running in parallel,
									with the prewarming threshold set to half that number.
								</Typography>
							</div>
						)}
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
};
